import express from 'express';
import multer from 'multer';
import verifyToken from '../middleware/authMiddleware.js';
import * as FavoriteController from '../controllers/FavouriteController.js';

const upload = multer();

const router = express.Router();

router.post('/favourite/add', verifyToken, upload.none(), FavoriteController.addFavourite);
router.get('/favourite', verifyToken, upload.none(), FavoriteController.getFavourites);
router.delete('/favourite/delete/:favouriteId', verifyToken, upload.none(), FavoriteController.removeFavourite);

export default router;