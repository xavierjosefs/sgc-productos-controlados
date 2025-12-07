// src/api/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import requestRoutes from "./request.routes.js";
import serviceRoutes from "./service.routes.js";
import adminRoutes from "./admin.routes.js";
import ventanillaRoutes from "./ventanilla.routes.js";
import tecnicoRoutes from "./tecnico.routes.js"
import { authMiddleware, adminOnlyMiddleware, ventanillaMiddleware, tecnicoMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();
// aquí van más rutas luego

router.use("/auth", authRoutes);
router.use("/requests", authMiddleware, requestRoutes);
router.use("/service-types", authMiddleware, serviceRoutes);
router.use("/admin", adminOnlyMiddleware, adminRoutes);
router.use("/ventanilla", ventanillaMiddleware, ventanillaRoutes);
router.use("/tecnico-upc",tecnicoMiddleware, tecnicoRoutes)


export default router;

