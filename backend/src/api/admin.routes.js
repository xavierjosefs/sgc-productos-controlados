import express from "express";
import { adminCreateInternalUser, getAllUsersController, changeUserRoleController, getAllRequestsController, changeUserStatusController, adminCreateServiceController, getAllServicesController, getAllFormsController, getDashboardStatsController, getRequestStatusesController, getServiceByCodeController, getUserByCedulaController, setUserStatusController } from "../controllers/admin.controllers.js";
import { getRequestsByStatusController } from "../controllers/request.controllers.js";
import { updateServiceController } from "../controllers/service.controllers.js";

const router = express.Router();
//aqui van las rutas de admin
router.post("/create-user", adminCreateInternalUser);
router.get("/get-users", getAllUsersController);
router.get("/get-requests/:status", getRequestsByStatusController);
router.put("/change-role", changeUserRoleController);
router.get("/get-all-requests", getAllRequestsController);
router.put("/users/:cedula/toggle-status", changeUserStatusController);
router.post("/create-service", adminCreateServiceController);
router.get("/get-services", getAllServicesController);
router.get("/get-forms", getAllFormsController);
router.get("/get-request-statuses", getRequestStatusesController);
router.get("/services/:code", getServiceByCodeController);
router.get("/users/:cedula", getUserByCedulaController);
router.put("/users/:cedula/status", setUserStatusController);
router.get("/stats", getDashboardStatsController);
router.put("/services/:id", updateServiceController);

export default router;