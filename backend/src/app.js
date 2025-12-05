import express from "express";
import apiRouter from "./api/index.js";
import cors from "cors";

const app = express();

app.use(express.json());

const whitelist = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
];

if (process.env.CLIENT_URL) {
    whitelist.push(process.env.CLIENT_URL);
}

app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true
}));

import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger.js";

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api", apiRouter);

import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

export default app;
