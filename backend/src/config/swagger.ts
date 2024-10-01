import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from 'express';

const options: swaggerJsDoc.Options = {
    definition: { // Fix typo here
        openapi: "3.0.0",
        info: {
            title: "Certificate Pannel API",
            version: "1.0.0",
            description: "API documentation for Certificate Pannel API",
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ["./src/routes/*.ts", "./src/models/*.ts"], // Specify the paths to your route and model files
};

const swaggerSpec = swaggerJsDoc(options);

const setUpSwagger = (app: Express) => {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setUpSwagger;
