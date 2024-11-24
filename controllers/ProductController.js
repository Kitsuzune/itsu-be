const Product = require('../models/ProductModel.js');
const User = require('../models/UserModel.js');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
const Favourite = require('../models/FavouriteModel.js');
const TransactionModel = require('../models/TransactionModel.js');
const Review = require('../models/ReviewModel.js');

const createProduct = async (req, res) => {
    try {
        const { name, price, description, status } = req.body;
        const productImage = req.file ? req.file.filename : null;

        const newProduct = await Product.create({ name, price, description, image: productImage, status });

        res.status(201).json({
            message: "Product created successfully",
            product: {
                ...newProduct.toJSON(),
                productImage: `${process.env.BASE_URL}/uploads/productImage/${productImage}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;
        const searchQuery = req.query.search;

        let whereClause = {};
        if (searchQuery) {
            whereClause = {
                [Sequelize.Op.or]: [
                    {
                        name: {
                            [Sequelize.Op.like]: `%${searchQuery}%`
                        }
                    },
                    {
                        description: {
                            [Sequelize.Op.like]: `%${searchQuery}%`
                        }
                    }
                ]
            };
        }

        const rating = await Review.findAll({
            attributes: ['productId', [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
            group: ['productId']
        });

        const { count, rows: products } = await Product.findAndCountAll({
            where: whereClause,
            offset: offset,
            limit: limit,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Products fetched successfully",
            products: products.map(product => {
                return {
                    ...product.toJSON(),
                    rating: parseFloat(rating.find(r => r.productId === product.id)?.dataValues.averageRating || 0).toFixed(1),
                    productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`
                };
            }),
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductsByBestSeller = async (req, res) => {
    try {
        const transaction_details = await TransactionModel.findAll({
            attributes: ['productList'],
            where: { status: 'success' }
        });

        const productList = transaction_details.map(product => {
            return JSON.parse(product.productList);
        });

        const product = productList.flat().map(product => {
            return product.productId;
        });

        const products = await Product.findAll({
            where: {
                id: product
            }
        });

        const rating = await Review.findAll({
            attributes: ['productId', [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']],
            group: ['productId']
        });

        res.status(200).json({
            message: "Products fetched successfully",
            products: products.map(product => {
                return {
                    ...product.toJSON(),
                    rating: parseFloat(rating.find(r => r.productId === product.id)?.dataValues.averageRating || 0).toFixed(1),
                    productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`
                };
            })
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        const userId = req.user.userId;

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const favourite = await Favourite.findOne({
            where: {
                userId: userId,
                productId: id
            }
        });

        const ordered = await TransactionModel.findOne({
            where: {
                userId: userId,
                productList: Sequelize.literal(`JSON_CONTAINS(productList, '[{"productId":"${id}"}]')`),
                status: 'success',
            }
        });

        const reviewed = await Review.findOne({
            where: {
                userId: userId,
                productId: id
            }
        });

        res.status(200).json({
            message: "Product fetched successfully",
            product: {
                ...product.toJSON(),
                productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`,
                isFavourite: favourite ? true : false,
                favouriteId: favourite ? favourite.id : null,
                isOrdered: ordered ? true : false,
                isReviewed: reviewed ? true : false,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const productImage = req.file ? req.file.filename : null;
        console.log(req.body);

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (req.body.productImage) {
            if (productImage && product.image) {
                fs.unlinkSync(path.join('uploads/productImage/', product.image));
            } else {
                productImage = product.image;
            }
        }

        console.log('test');

        product.name = name;
        product.price = price;
        product.description = description;

        if (productImage !== null) {
            product.image = productImage;
        }

        await product.save();

        res.status(200).json({
            message: "Product updated successfully",
            product: {
                ...product.toJSON(),
                productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        fs.unlinkSync(path.join('uploads/productImage/', product.image));

        await product.destroy();

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductsByBestSeller,
    getProductById,
    updateProduct,
    deleteProduct
};