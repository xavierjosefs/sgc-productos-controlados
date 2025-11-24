import express from "express";
import { preRegister, getPreData, registerComplete, loginUser } from "../controllers/auth.controllers.js";
import { createRequestController } from "../controllers/request.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/pre-register", preRegister);
router.get("/pre-data", getPreData);
router.post("/register-complete", registerComplete);
router.post("/login", loginUser);
router.post("/requests", authMiddleware, createRequestController);

export default router;
