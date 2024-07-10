import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";

const { DataTypes } = Sequelize;

const Auth = db.define("auths", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
    updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
    },
});

export default Auth;