import Cart from "../models/CartModel.js";
import Product from "../models/ProductModel.js";
import User from "../models/UserModel.js";

export const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cart = await Cart.findAll({
            where: {
                userId,
            },
            include: {
                model: Product,
                as: "product",
            },
        });

        const modifiedCart = cart.map(item => ({
            ...item.toJSON(),
            product: {
                ...item.product.toJSON(),
                image: `${process.env.BASE_URL}/uploads/productImage/${item.product.image}`,
            },
        }));

        res.status(200).json({ cart: modifiedCart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user.userId;
        console.log(userId);

        const product = await Product.findByPk(productId);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cart = await Cart.findOne({
            where: {
                productId,
                userId,
            },
        });

        if (cart) {
            cart.quantity += quantity;
            await cart.save();
        } else {
            await Cart.create({ productId, userId, quantity });
        }

        res.status(201).json({ message: "Product added to cart successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const plusQuantity = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findByPk(cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.quantity += 1;
        await cart.save();

        res.status(200).json({ message: "Quantity increased successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const minusQuantity = async (req, res) => {
    try {
        const { cartId } = req.params;

        const cart = await Cart.findByPk(cartId);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        if (cart.quantity === 1) {
            await cart.destroy();
        } else {
            cart.quantity -= 1;
            await cart.save();
        }

        res.status(200).json({ message: "Quantity decreased successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};