import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import path from 'path';
import fs from 'fs';
import Review from '../models/ReviewModel.js';

export const addReview = async (req, res) => {
    const { productId, review, rating } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (await Review.findOne({ where: { userId, productId } })) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const ratingValue = parseInt(rating);
        if (ratingValue < 1 || ratingValue > 5) {
            return res.status(400).json({ message: "Rating must be between 1 and 5" });
        }

        const reviewData = await Review.create({
            userId,
            productId,
            review,
            rating,
        });

        res.status(200).json({
            message: "Review added successfully",
            data: reviewData,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getReviewsById = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const reviews = await Review.findAll({
            where: { productId },
            include: [
                {
                    model: User,
                    as: 'user',
                },
            ],
        });

        res.status(200).json({
            message: "Reviews retrieved successfully",
            data: {
                reviewTotal: reviews.length,
                meanRating: reviews.length > 0 ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1) : "0.0",
                oneStarRating: reviews.filter(review => review.rating === 1).length,
                twoStarRating: reviews.filter(review => review.rating === 2).length,
                threeStarRating: reviews.filter(review => review.rating === 3).length,
                fourStarRating: reviews.filter(review => review.rating === 4).length,
                fiveStarRating: reviews.filter(review => review.rating === 5).length,
                reviews : reviews.map(review => {
                    return {
                        ...review.toJSON(),
                        user: {
                            username: review.user.username,
                            // profilePicture: review.user.profilePicture,
                            profilePicture: review.user.profilePicture ? `${process.env.BASE_URL}/uploads/profilePicture/${review.user.profilePicture}` : null,
                        },
                    };
                }),
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}