import { Sequelize } from "sequelize";
import db from "../config/ModelConfig.js";

const { DataTypes } = Sequelize;

const User = db.define("users", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

export default User;