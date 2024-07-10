var DataTypes = require("sequelize").DataTypes;
var _auths = require("./auths");
var _banners = require("./banners");
var _carts = require("./carts");
var _coupons = require("./coupons");
var _favourites = require("./favourites");
var _feedbacks = require("./feedbacks");
var _flashsales = require("./flashsales");
var _products = require("./products");
var _reviews = require("./reviews");
var _sequelizemeta = require("./sequelizemeta");
var _transactions = require("./transactions");
var _users = require("./users");

function initModels(sequelize) {
  var auths = _auths(sequelize, DataTypes);
  var banners = _banners(sequelize, DataTypes);
  var carts = _carts(sequelize, DataTypes);
  var coupons = _coupons(sequelize, DataTypes);
  var favourites = _favourites(sequelize, DataTypes);
  var feedbacks = _feedbacks(sequelize, DataTypes);
  var flashsales = _flashsales(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var reviews = _reviews(sequelize, DataTypes);
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var transactions = _transactions(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  carts.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(carts, { as: "carts", foreignKey: "productId"});
  favourites.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(favourites, { as: "favourites", foreignKey: "productId"});
  flashsales.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(flashsales, { as: "flashsales", foreignKey: "productId"});
  reviews.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(reviews, { as: "reviews", foreignKey: "productId"});
  transactions.belongsTo(products, { as: "product", foreignKey: "productId"});
  products.hasMany(transactions, { as: "transactions", foreignKey: "productId"});
  auths.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(auths, { as: "auths", foreignKey: "userId"});
  carts.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(carts, { as: "carts", foreignKey: "userId"});
  favourites.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(favourites, { as: "favourites", foreignKey: "userId"});
  feedbacks.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(feedbacks, { as: "feedbacks", foreignKey: "userId"});
  reviews.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(reviews, { as: "reviews", foreignKey: "userId"});
  transactions.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(transactions, { as: "transactions", foreignKey: "userId"});

  return {
    auths,
    banners,
    carts,
    coupons,
    favourites,
    feedbacks,
    flashsales,
    products,
    reviews,
    sequelizemeta,
    transactions,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
