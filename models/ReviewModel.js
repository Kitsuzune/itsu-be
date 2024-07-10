import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";

const { DataTypes } = Sequelize;

const Review = db.define("reviews", {
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
    review: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

export default Review;