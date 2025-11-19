import express from "express";
import apiRouter from "./api/index.js"; // las rutas

const app = express();

app.use(express.json());

// prefijo para rutas
app.use("/api", apiRouter);

export default app;
