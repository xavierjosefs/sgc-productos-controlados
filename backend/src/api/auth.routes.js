import express from "express";
import { preRegister, getPreData, registerComplete } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/pre-register", preRegister);
router.get("/pre-data", getPreData);
router.post("/register-complete", registerComplete);

export default router;
