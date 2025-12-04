import express from "express";
import { preRegister, getPreData, registerComplete, loginUser, getProfile } from "../controllers/auth.controllers.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /auth/pre-register:
 *   post:
 *     summary: Pre-register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pre-registration successful
 *       400:
 *         description: Bad request
 */
router.post("/pre-register", preRegister);
router.get("/pre-data", getPreData);
router.post("/register-complete", registerComplete);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Unauthorized
 */
router.post("/login", loginUser);
router.get("/me", authMiddleware, getProfile);


export default router;
