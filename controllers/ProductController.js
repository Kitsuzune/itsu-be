import Product from '../models/ProductModel.js';
import User from '../models/UserModel.js';
import path from 'path';
import fs from 'fs';
import { Sequelize } from 'sequelize';

export const createProduct = async (req, res) => {
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

export const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const offset = (page - 1) * limit;

        const { count, rows: products } = await Product.findAndCountAll({
            offset: offset,
            limit: limit,
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({
            message: "Products fetched successfully",
            products: products.map(product => {
                return {
                    ...product.toJSON(),
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

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const relatedProducts = await Product.findAll({
            where: {
                id: {
                    [Sequelize.Op.not]: product.id
                }
            },
            limit: 4,
            order: Sequelize.literal("rand()")
        });

        res.status(200).json({
            message: "Product fetched successfully",
            product: {
                ...product.toJSON(),
                productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`,
                relatedProducts: relatedProducts.map(product => {
                    return {
                        ...product.toJSON(),
                        productImage: `${process.env.BASE_URL}/uploads/productImage/${product.image}`
                    };
                })
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, description } = req.body;
        const productImage = req.file ? req.file.filename : null;
        console.log(req.body);

        const product = await Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (productImage && product.image) {
            fs.unlinkSync(path.join('uploads/productImage/', product.image));
        } else {
            productImage = product.image;
        }

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

export const deleteProduct = async (req, res) => {
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