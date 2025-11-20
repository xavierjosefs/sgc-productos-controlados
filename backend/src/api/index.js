// src/api/index.js
import express from "express";
import authRoutes from "./auth.routes.js";

const router = express.Router();
// aquí van más rutas luego

router.use("/auth", authRoutes);


export default router;
