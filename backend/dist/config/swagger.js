"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const options = {
    definition: {
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
const swaggerSpec = (0, swagger_jsdoc_1.default)(options);
const setUpSwagger = (app) => {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
};
exports.default = setUpSwagger;
