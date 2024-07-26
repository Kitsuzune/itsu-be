import express from 'express';
import * as ReviewController from '../controllers/ReviewController.js';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';

const upload = multer();

const router = express.Router();

router.post('/review/add', verifyToken, upload.none(), ReviewController.addReview);
router.get('/review/:productId', upload.none(), ReviewController.getReviewsById);

export default router;