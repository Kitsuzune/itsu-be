import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";
import Product from "./ProductModel.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Cart = db.define("carts", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id',
        },
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});


Product.hasMany(Cart, { foreignKey: 'productId', as: 'carts' });
Cart.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

User.hasMany(Cart, { foreignKey: 'userId', as: 'carts' });
Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Cart;