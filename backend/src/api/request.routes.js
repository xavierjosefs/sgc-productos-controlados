import express from "express";
import { createRequestController, getRequestsController } from "../controllers/request.controllers.js";

const router = express.Router();
router.post("/create-requests", createRequestController);
router.get("/get-requests", getRequestsController);

export default router;