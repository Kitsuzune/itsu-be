const express = require('express');
const ReviewController = require('../controllers/ReviewController.js');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');

const upload = multer();

const router = express.Router();

router.post('/review/add', verifyToken, upload.none(), ReviewController.addReview);
router.get('/review/:productId', upload.none(), ReviewController.getReviewsById);

module.exports = router;