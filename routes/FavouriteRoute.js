const express = require('express');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');
const FavoriteController = require('../controllers/FavouriteController.js');

const upload = multer();

const router = express.Router();

router.post('/favourite/add', verifyToken, upload.none(), FavoriteController.addFavourite);
router.get('/favourite', verifyToken, upload.none(), FavoriteController.getFavourites);
router.delete('/favourite/delete/:favouriteId', verifyToken, upload.none(), FavoriteController.removeFavourite);

module.exports = router;