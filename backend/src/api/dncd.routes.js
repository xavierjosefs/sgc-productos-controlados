import express from "express";
import {
    getDNCDRequestsController,
    getDNCDRequestDetailController,
    getDNCDCertificatePDFController
} from "../controllers/dncd.controllers.js";

const router = express.Router();

// Get all requests for DNCD (approved and rejected by Direccion)
router.get("/requests", getDNCDRequestsController);

// Get request detail by ID
router.get("/requests/:id", getDNCDRequestDetailController);

// Get certificate PDF
router.get("/certificate/:id", getDNCDCertificatePDFController);

export default router;
