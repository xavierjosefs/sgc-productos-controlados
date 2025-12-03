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

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", apiRouter);

import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

export default app;
