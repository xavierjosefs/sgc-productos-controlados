import express from "express";
import getDNCDRequestsController from "../controllers/dncd.controllers.js"

const router = express.Router();
router.get("/requests", getDNCDRequestsController)

export default router;
