import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { createRequestController, getRequestsController, getRequestDetailsController, getSendRequestsController, getAproveRequestsController, getReturnedRequestsController, getPendingRequestsController, getRequestsStatusController } from "../controllers/request.controllers.js";
import { uploadDocumentController, getDocumentosBySolicitudController, deleteDocumentController } from "../controllers/document.controllers.js";

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

/**
 * @swagger
 * /requests/{id}/documents/{documentId}:
 *   delete:
 *     summary: Delete a document from a request
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Request ID
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Document ID to delete
 *     responses:
 *       200:
 *         description: Document deleted successfully
 *       400:
 *         description: Document does not belong to the request
 *       403:
 *         description: User not authorized to delete documents from this request
 *       404:
 *         description: Document or request not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id/documents/:documentId", deleteDocumentController);
router.get("/send", getSendRequestsController);
router.get("/aprove", getAproveRequestsController);
router.get("/returned", getReturnedRequestsController);
router.get("/pending", getPendingRequestsController);
router.get("/status", getRequestsStatusController);


export default router;
