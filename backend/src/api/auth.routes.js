import express from "express";
import { preRegister, getPreData, registerComplete, loginUser } from "../controllers/auth.controllers.js";

const router = express.Router();

router.post("/pre-register", preRegister);
router.get("/pre-data", getPreData);
router.post("/register-complete", registerComplete);
router.post("/login", loginUser);


export default router;
