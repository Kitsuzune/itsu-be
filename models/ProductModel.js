const Sequelize = require("sequelize");
const db = require("../config/ModelConfig.js");
const Favourite = require("./FavouriteModel.js");

const { DataTypes } = Sequelize;

const Product = db.define("products", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
});

Product.hasMany(Favourite, { foreignKey: 'productId', as: 'favourites' });
Favourite.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = Product;