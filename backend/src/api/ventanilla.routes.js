import express from "express";
import { getVentanillaRequestsController } from "../controllers/ventanilla.controllers.js";
import { getTecnicoUPCRequestsController } from "../controllers/tecnico.controllers.js";

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
router.get("/tecnico-upc/requests", getTecnicoUPCRequestsController);

/**
 * @swagger
 * /ventanilla/validate/{id}:
 *   post:
 *     summary: Validate a request (Cumple/No Cumple)
 *     tags: [Ventanilla]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               reasons:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request updated
 */
import { validateRequestController, getRequestDetailController } from "../controllers/ventanilla.controllers.js";
router.post("/validate/:id", validateRequestController);

/**
 * @swagger
 * /ventanilla/request/{id}:
 *   get:
 *     summary: Get request detail with validations
 *     tags: [Ventanilla]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request detail with validations
 */
router.get("/request/:id", getRequestDetailController);

export default router;
