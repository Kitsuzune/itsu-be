import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";
import Favourite from "../models/FavouriteModel.js";

export const addFavourite = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const favourite = await Favourite.create({
            userId,
            productId,
        });

        res.status(200).json({
            message: "Favourite added successfully",
            data: favourite,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFavourites = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;


        // const favourites = await Favourite.findAll({
        //     where: { userId },
        //     include: [
        //         {
        //             model: Product,
        //             as: 'product',
        //         },
        //     ],
        // });

        const { count, rows: favourites } = await Favourite.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: Product,
                    as: 'product',
                },
            ],
            offset: offset,
            limit: limit,
        });

        res.status(200).json({
            message: "Favourites retrieved successfully",
            // data: favourites,
            wishlist: favourites.map(favourite => {
                return {
                    ...favourite.toJSON(),
                    product: {
                        ...favourite.product.toJSON(),
                        productImage: `${process.env.BASE_URL}/uploads/productImage/${favourite.product.image}`
                    }
                }
            }),
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const removeFavourite = async (req, res) => {
    const { favouriteId } = req.params;
    const userId = req.user.userId;

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const favourite = await Favourite.findByPk(favouriteId);
        if (!favourite) {
            return res.status(404).json({ message: "Favourite not found" });
        }

        await favourite.destroy();

        res.status(200).json({ message: "Favourite removed successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}