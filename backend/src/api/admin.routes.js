import express from "express";
import { adminCreateInternalUser, getAllUsersController, changeUserRoleController, getAllRequestsController } from "../controllers/admin.controllers.js";
import { getRequestsByStatusController } from "../controllers/request.controllers.js";

const router = express.Router();
//aqui van las rutas de admin
router.post("/create-user", adminCreateInternalUser);
router.get("/get-users", getAllUsersController);
router.get("/get-requests/:status", getRequestsByStatusController);
router.put("/change-role", changeUserRoleController);
router.get("/get-all-requests", getAllRequestsController);
export default router;