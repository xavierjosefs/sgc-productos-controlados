import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { createRequestController, getRequestsController, uploadDocumentController } from "../controllers/request.controllers.js";

const router = express.Router();
router.post("/create-requests", createRequestController);
router.get("/get-requests", getRequestsController);
router.post("/:id/document", upload.single("document"), uploadDocumentController);

export default router;