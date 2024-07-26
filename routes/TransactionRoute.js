import express from 'express';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';
import * as TransactionController from '../controllers/TransactionController.js';
import midtransClient from 'midtrans-client';

const upload = multer();

const router = express.Router();

router.post('/transaction/create', verifyToken, upload.none(), TransactionController.createTransaction);
router.post('/transaction/updateStatus', verifyToken, upload.none(), TransactionController.updateTransactionStatus);
router.post('/transaction/midNotification', verifyToken, upload.none(), TransactionController.midtransNotification);

router.get('/transaction/listAllByUser', verifyToken, upload.none(), TransactionController.transactionListByuser);
router.get('/transaction/AdminList', verifyToken, upload.none(), TransactionController.transactionAllList);

export default router;