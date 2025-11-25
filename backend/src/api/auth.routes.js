import express from "express";
import { preRegister, getPreData, registerComplete, loginUser, forgotPassword, verifyOtp, resetPassword } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/pre-register", preRegister);
router.get("/pre-data", getPreData);
router.post("/register-complete", registerComplete);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

export default router;
