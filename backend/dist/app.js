"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const certificateRoutes_1 = __importDefault(require("./routes/certificateRoutes"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const swagger_1 = __importDefault(require("./config/swagger"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// CORS configuration
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use((0, morgan_1.default)('dev')); // Logging
app.use(express_1.default.json()); // Parse JSON bodies
// Routes
app.use('/api/auth', authRoutes_1.default); // This line adds the correct prefix to your routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/certificates', certificateRoutes_1.default);
// Swagger Documentation
(0, swagger_1.default)(app);
// Error Handling Middleware
app.use(errorHandler_1.default);
exports.default = app;
