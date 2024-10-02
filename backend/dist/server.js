"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
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
                url: 'https://cretificate-pannel-production.up.railway.app/',
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
// Connect to Database
(0, db_1.default)();
// Handle preflight requests explicitly
app.options('*', (0, cors_1.default)({
    origin: ['https://cretificate-pannel.vercel.app/', 'http://localhost:3000'],
    credentials: true
}));
// Enable CORS
app.use('*', (0, cors_1.default)({
    origin: ['https://cretificate-pannel.vercel.app/', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// Middleware
app.use((0, morgan_1.default)('dev')); // Logging
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json()); // Parse JSON bodies
app.use(express_1.default.urlencoded({ extended: true })); // Parse form-encoded data
// Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/certificates', certificateRoutes_1.default);
// Error Handling Middleware
app.use(errorHandler_1.default);
// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000....');
});
