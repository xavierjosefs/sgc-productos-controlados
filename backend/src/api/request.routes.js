import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { createRequestController, getRequestsController } from "../controllers/request.controllers.js";
import { uploadDocumentController } from "../controllers/document.controllers.js";

const router = express.Router();
router.post("/create-requests", createRequestController);
router.get("/get-requests", getRequestsController);
router.post("/:id/documents", upload.single("archivo"), uploadDocumentController );

export default router;
