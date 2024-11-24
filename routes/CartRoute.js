const express = require('express');
const CartController = require('../controllers/CartController.js');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');

const upload = multer();
const router = express.Router();

router.get('/cart', verifyToken, CartController.getCart);
router.post('/cart/add', verifyToken, upload.none(), CartController.addToCart);
router.post('/cart/plus/:cartId', verifyToken, upload.none(), CartController.plusQuantity);
router.post('/cart/minus/:cartId', verifyToken, upload.none(), CartController.minusQuantity);

module.exports = router;