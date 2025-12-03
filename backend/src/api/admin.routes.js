import express from "express";
import { createUserController } from "../controllers/admin.controllers.js";

const router = express.Router();
//aqui van las rutas de admin
router.post("/create-user", createUserController);
export default router;