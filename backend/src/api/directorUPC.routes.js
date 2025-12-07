import express from "express";
import { getDirectorRequestsController, getDirectorUPCRequestDetailsController } from "../controllers/directorUPC.controllers.js"

const router = express.Router();
//aqui van las rutas del directorUPC
router.get("/requests", getDirectorRequestsController);
router.get("/requests/:id", getDirectorUPCRequestDetailsController);



export default router;