import express from "express";
import {
    getDireccionRequestsController,
    getDireccionRequestDetailController,
    validateDireccionRequestController,
    generateCertificatePDFController
} from "../controllers/direccion.controllers.js";
import { direccionDecisionController } from "../controllers/direccionDecision.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: DirectorGeneral
 *   description: Endpoints for Director General role
 */

/**
 * @swagger
 * /director-general/requests:
 *   get:
 *     summary: Get all requests for Director General (estado Aprobada por UPC)
 *     tags: [DirectorGeneral]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *       403:
 *         description: Access denied - Director General role required
 *       500:
 *         description: Internal server error
 */
router.get("/requests", getDireccionRequestsController);

/**
 * @swagger
 * /director-general/request/{id}:
 *   get:
 *     summary: Get request detail with documents
 *     tags: [DirectorGeneral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Request detail with documents
 */
router.get("/requests/:id", getDireccionRequestDetailController);

// Endpoint para decisión (APROBAR/RECHAZAR) - usado por el frontend
router.post("/requests/:id/decision", direccionDecisionController);

/**
 * @swagger
 * /director-general/validate/{id}:
 *   post:
 *     summary: Validate a request (Aprobar/Reprobar)
 *     tags: [DirectorGeneral]
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
 *                 enum: [aprobado_direccion, rechazado_direccion]
 *               reasons:
 *                 type: string
 *     responses:
 *       200:
 *         description: Request updated
 */
router.post("/validate/:id", validateDireccionRequestController);

/**
 * @swagger
 * /director-general/certificate/{id}:
 *   get:
 *     summary: Generate and download certificate PDF
 *     tags: [DirectorGeneral]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *     responses:
 *       200:
 *         description: PDF certificate file
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Request not found
 *       500:
 *         description: Error generating PDF
 */
router.get("/certificate/:id", generateCertificatePDFController);

export default router;
