const express = require('express');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');
const TransactionController = require('../controllers/TransactionController.js');
const midtransClient = require('midtrans-client');

const upload = multer();

const router = express.Router();

router.post('/transaction/create', verifyToken, upload.none(), TransactionController.createTransaction);
router.post('/transaction/updateStatus', verifyToken, upload.none(), TransactionController.updateTransactionStatus);
router.post('/transaction/midNotification', verifyToken, upload.none(), TransactionController.midtransNotification);

router.get('/transaction/listAllByUser', verifyToken, upload.none(), TransactionController.transactionListByuser);
router.get('/transaction/AdminList', verifyToken, upload.none(), TransactionController.transactionAllList);

module.exports = router;