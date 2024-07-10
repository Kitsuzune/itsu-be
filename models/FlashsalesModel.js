import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";

const { DataTypes } = Sequelize;

const Flashsale = db.define("flashsales", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id',
        },
    },
    discount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    end: {
        type: DataTypes.DATE,
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

export default Flashsale;
