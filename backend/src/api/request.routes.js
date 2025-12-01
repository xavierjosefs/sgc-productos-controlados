import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { createRequestController, getRequestsController, getRequestDetailsController, getSendRequestsController, getAproveRequestsController, getReturnedRequestsController, getPendingRequestsController } from "../controllers/request.controllers.js";
import { uploadDocumentController, getDocumentosBySolicitudController } from "../controllers/document.controllers.js";

const router = express.Router();
router.post("/create-requests", createRequestController);
router.get("/get-requests", getRequestsController);
router.post("/:id/documents", upload.single("archivo"), uploadDocumentController );
router.get("/:id/details", getRequestDetailsController);
router.get("/:id/documents", getDocumentosBySolicitudController);
router.get("/send", getSendRequestsController);
router.get("/aprove", getAproveRequestsController);
router.get("/returned", getReturnedRequestsController);
router.get("/pending", getPendingRequestsController);

export default router;
