import express from "express";
import multer from "multer";
import { analyzePlant, downloadPDF, getHistory, deleteHistory } from "../controllers/plantController.js";
import { verifyToken } from "../middleware/authmiddleware.js";
import { registerData, login, getProfile } from "../controllers/authController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Plant API Routes
router.post("/analyze", verifyToken, upload.single("image"), analyzePlant);
router.post("/download", verifyToken, downloadPDF);
router.get("/history", verifyToken, getHistory);
router.delete("/history/:id", verifyToken, deleteHistory);

// Auth API Routes
router.post('/register', registerData);
router.post('/login', login);
router.get("/profile", verifyToken, getProfile);

export default router;