import express from "express";
import { getVentanillaRequestsController } from "../controllers/ventanilla.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Ventanilla
 *   description: Endpoints for Ventanilla role
 */

/**
 * @swagger
 * /ventanilla/requests:
 *   get:
 *     summary: Get all requests for Ventanilla (estado ENVIADA)
 *     tags: [Ventanilla]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *       403:
 *         description: Access denied - Ventanilla role required
 *       500:
 *         description: Internal server error
 */
router.get("/requests", getVentanillaRequestsController);

export default router;
