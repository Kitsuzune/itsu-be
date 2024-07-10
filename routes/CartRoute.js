import express from 'express';
import * as CartController from '../controllers/CartController.js';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';

const upload = multer();
const router = express.Router();

router.get('/cart', verifyToken, CartController.getCart);
router.post('/cart/add', verifyToken, upload.none(), CartController.addToCart);
router.post('/cart/plus/:cartId', verifyToken, upload.none(), CartController.plusQuantity);
router.post('/cart/minus/:cartId', verifyToken, upload.none(), CartController.minusQuantity);

export default router;