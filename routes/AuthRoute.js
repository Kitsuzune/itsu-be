import express from "express";
import * as AuthController from "../controllers/AuthController.js";
import multer from 'multer';
import verifyToken from "../middleware/authMiddleware.js";

const upload = multer();

const router = express.Router();

router.post("/register", upload.none(), AuthController.register);
router.post("/login", upload.none(), AuthController.login);
router.post("/change-password", upload.none(), verifyToken, AuthController.changePassword);

export default router;
