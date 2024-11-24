const express = require('express');
const UserController = require('../controllers/UserController.js');
const multer = require('multer');
const verifyToken = require('../middleware/authMiddleware.js');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profilePicture/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = multer({ storage });

const router = express.Router();

router.get('/users', UserController.getUsers);
router.post('/users/add', upload.none(), verifyToken, UserController.createUser);
router.put('/profile/detail', upload.none(), verifyToken, UserController.editProfileDetail);
router.put('/profile/picture', upload.single('profilePicture'), verifyToken, UserController.editProfilePicture);
router.get('/profile/detail', verifyToken, UserController.getProfileDetail);
router.get('/profile/picture', verifyToken, UserController.getProfilePicture);

module.exports = router;