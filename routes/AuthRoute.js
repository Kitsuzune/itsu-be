const express = require("express");
const AuthController = require("../controllers/AuthController.js");
const multer = require('multer');
const verifyToken = require("../middleware/authMiddleware.js");

const upload = multer();

const router = express.Router();

router.post("/register", upload.none(), AuthController.register);
router.post("/login", upload.none(), AuthController.login);
router.post("/change-password", upload.none(), verifyToken, AuthController.changePassword);

module.exports = router;
