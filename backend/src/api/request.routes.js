import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { createRequestController, getRequestsController, getRequestDetailsController, getSendRequestsController, getAproveRequestsController, getReturnedRequestsController, getPendingRequestsController } from "../controllers/request.controllers.js";
import { uploadDocumentController, getDocumentosBySolicitudController } from "../controllers/document.controllers.js";

const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Requests
 *   description: Request management endpoints
 */

/**
 * @swagger
 * /requests/create-requests:
 *   post:
 *     summary: Create a new request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_servicio:
 *                 type: string
 *               formulario:
 *                 type: object
 *     responses:
 *       201:
 *         description: Request created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/create-requests", createRequestController);
router.get("/get-requests", getRequestsController);
router.post("/:id/documents", upload.single("archivo"), uploadDocumentController);
router.get("/:id/details", getRequestDetailsController);
router.get("/:id/documents", getDocumentosBySolicitudController);
router.get("/send", getSendRequestsController);
router.get("/aprove", getAproveRequestsController);
router.get("/returned", getReturnedRequestsController);
router.get("/pending", getPendingRequestsController);

export default router;
