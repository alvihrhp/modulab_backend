import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

// POST /api/auth/login
router.post("/login", authController.login);

// POST /api/auth/register
router.post("/register", authController.register);

export default router;
