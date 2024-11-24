import express from 'express';
import * as ProductController from '../controllers/ProductController.mjs';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/productImage/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/product', ProductController.getProducts);
router.get('/product/:id', verifyToken, ProductController.getProductById);
router.get('/product/sort/best-seller', ProductController.getProductsByBestSeller);
router.post('/product/add', upload.single('productImage'), verifyToken, ProductController.createProduct);
router.patch('/product/update/:id', upload.single('productImage'), verifyToken, ProductController.updateProduct);
router.delete('/product/delete/:id', verifyToken, ProductController.deleteProduct);

export default router;