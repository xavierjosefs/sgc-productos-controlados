import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "SGC Productos Controlados API",
            version: "1.0.0",
            description: "API documentation for SGC Productos Controlados",
        },
        servers: [
            {
                url: "http://localhost:8000/api",
                description: "Development server",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./src/api/*.routes.js"], // Path to the API docs
};

export const swaggerSpec = swaggerJSDoc(options);
