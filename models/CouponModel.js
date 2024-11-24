const { Sequelize } = require("sequelize");
const db = require("../config/ModelConfig.js");

const { DataTypes } = Sequelize;

const Coupon = db.define("coupons", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    code: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    discount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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

module.exports = Coupon;