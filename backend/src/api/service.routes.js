import express from "express";
import { getServiceTypesController } from "../controllers/service.controllers.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Services
 *   description: Service management endpoints
 */

/**
 * @swagger
 * /service-types:
 *   get:
 *     summary: Get all service types
 *     tags: [Services]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of service types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   nombre_servicio:
 *                     type: string
 *                   precio:
 *                     type: number
 *       500:
 *         description: Internal server error
 */
router.get("/", getServiceTypesController);

export default router;
