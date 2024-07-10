import express from 'express';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';
import * as TransactionController from '../controllers/TransactionController.js';
import midtransClient from 'midtrans-client';

const upload = multer();

const router = express.Router();

router.post('/transaction/create', verifyToken, upload.none(), TransactionController.createTransaction);
router.post('/transaction/updateStatus', upload.none(), TransactionController.updateTransactionStatus);

export default router;