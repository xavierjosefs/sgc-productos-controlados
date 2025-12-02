import express from "express";
import apiRouter from "./api/index.js";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:5174"], 
    methods: "GET,POST,PUT,DELETE", 
    credentials: true
}));

app.use("/api", apiRouter);

export default app;
