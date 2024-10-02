"use strict";
// middleware/authMiddleware.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const userModel_1 = __importDefault(require("../models/userModel"));
dotenv_1.default.config();
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.auth_token;
    console.log('Token: authMiddleware', token);
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);
        //@ts-ignore
        const user = yield userModel_1.default.findById(decoded.id);
        if (!user || !user.tokens.includes(token)) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        console.log('User:', req.user);
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
});
exports.authMiddleware = authMiddleware;
const adminMiddleware = (req, res, next) => {
    console.log('req body:', req.body);
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};
exports.adminMiddleware = adminMiddleware;
