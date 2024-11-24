const { Sequelize } = require("sequelize");
const db = require("../config/ModelConfig.js");
const TransactionModel = require("./TransactionModel.js");
const Review = require("./ReviewModel.js");

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

User.hasMany(TransactionModel, { foreignKey: 'userId', as: 'transactions' });
TransactionModel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = User;
