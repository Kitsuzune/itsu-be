import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";

const { DataTypes } = Sequelize;

const Transaction = db.define("transactions", {
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
    productList: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    deduction: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    total: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'success', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
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

export default Transaction;