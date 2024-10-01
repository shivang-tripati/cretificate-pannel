"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
// Create Express app
const app = (0, express_1.default)();
// Swagger configuration
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Sample API',
            version: '1.0.0',
            description: 'Sample API documentation',
        },
        servers: [
            {
                url: 'http://localhost:5000',
            },
        ],
    },
    apis: ['./src/routes/*.ts'], // Adjust paths as needed
};
// Generate Swagger specification
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
// Set up Swagger UI
const setUpSwagger = (app) => {
    console.log('Setting up Swagger');
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
// Call the function to set up Swagger
setUpSwagger(app);
// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
exports.default = setUpSwagger;
