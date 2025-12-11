import express from "express";
import {
    getDireccionRequestsController,
    getDireccionRequestDetailController,
    validateDireccionRequestController,
    generateCertificatePDFController
} from "../controllers/direccion.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Direccion
 *   description: Endpoints for Dirección role
 */

/**
 * @swagger
 * /direccion/requests:
 *   get:
 *     summary: Get all requests for Dirección (estado Aprobada por UPC)
 *     tags: [Direccion]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of requests
 *       403:
 *         description: Access denied - Dirección role required
 *       500:
 *         description: Internal server error
 */
router.get("/requests", getDireccionRequestsController);

/**
 * @swagger
 * /direccion/request/{id}:
 *   get:
 *     summary: Get request detail with documents
 *     tags: [Direccion]
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
router.get("/request/:id", getDireccionRequestDetailController);

/**
 * @swagger
 * /direccion/validate/{id}:
 *   post:
 *     summary: Validate a request (Aprobar/Reprobar)
 *     tags: [Direccion]
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
 * /direccion/certificate/{id}:
 *   get:
 *     summary: Generate and download certificate PDF
 *     tags: [Direccion]
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
