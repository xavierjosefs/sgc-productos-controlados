// src/api/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import requestRoutes from "./request.routes.js";
import { authMiddleware } from "../middleware/auth.middleware.js";


const router = express.Router();
// aqu├¡ van m├ís rutas luego

router.use("/auth", authRoutes);
router.use("/requests", authMiddleware, requestRoutes);


export default router;
