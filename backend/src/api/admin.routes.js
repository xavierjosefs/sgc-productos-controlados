import express from "express";
import { adminCreateInternalUser, getAllUsersController } from "../controllers/admin.controllers.js";

const router = express.Router();
//aqui van las rutas de admin
router.post("/create-user", adminCreateInternalUser);
router.get("/get-users", getAllUsersController);
export default router;