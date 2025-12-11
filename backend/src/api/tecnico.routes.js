import express from "express";
import { getTecnicoUPCRequestsController, getTecnicoUPCRequestDetailsController, validarSolicitudTecnicaController } from "../controllers/tecnico.controllers.js"

const router = express.Router();
//aqui van las rutas de tecnico
router.get("/requests", getTecnicoUPCRequestsController);
router.get("/requests/:id", getTecnicoUPCRequestDetailsController);
router.post("/request/:id/validacion-tecnica", validarSolicitudTecnicaController);



export default router;