// src/api/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import requestRoutes from "./request.routes.js";
import serviceRoutes from "./service.routes.js";
import adminRoutes from "./admin.routes.js";
import { authMiddleware, adminOnlyMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();
// aquí van más rutas luego

router.use("/auth", authRoutes);
router.use("/requests", authMiddleware, requestRoutes);
router.use("/service-types", authMiddleware, serviceRoutes);
router.use("/admin", adminOnlyMiddleware, adminRoutes);


export default router;
