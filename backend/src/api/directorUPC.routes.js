import express from "express";
import { getDirectorRequestsController, getDirectorUPCRequestDetailsController,directorUPCDecisionController } from "../controllers/directorUPC.controllers.js"

const router = express.Router();
//aqui van las rutas del directorUPC
router.get("/requests", getDirectorRequestsController);
router.get("/requests/:id", getDirectorUPCRequestDetailsController);
router.post("/requests/:id/decision", directorUPCDecisionController)



export default router;