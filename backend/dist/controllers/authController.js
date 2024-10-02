"use strict";
// controllers/authController.ts
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
exports.logoutFromAllDevices = exports.logout = exports.login = exports.register = void 0;
const jwt_1 = require("../utils/jwt");
const predefinedEmailModel_1 = __importDefault(require("../models/predefinedEmailModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userService_1 = require("../services/userService");
// interface IUser {
//     _id: string;
//     email: string;
//     role: string;
//     // Add other user properties as needed
// }
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Check for predefined email
        const predefinedEmail = yield predefinedEmailModel_1.default.findOne({ email });
        if (!predefinedEmail) {
            return res.status(400).json({ message: 'Email not authorized for registration' });
        }
        // Check if user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Register the user
        const user = yield (0, userService_1.registerUser)(email, password);
        const token = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
        // Set the token in an HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
        res.status(201).json({ user });
    }
    catch (error) {
        console.error("Error during registration:", error);
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield (0, userService_1.authenticateUser)(email, password);
        console.log("Authentication result:", result);
        if ('isMatch' in result && !result.isMatch) {
            return res.status(401).json({ message: result.message });
        }
        if ('user' in result) {
            const user = result.user;
            const token = (0, jwt_1.generateToken)({ id: user._id, role: user.role });
            user === null || user === void 0 ? void 0 : user.tokens.push(token);
            yield user.save();
            console.log("User:", user);
            // Set the token in an HTTP-only cookie
            res.cookie('auth_token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            });
            res.status(200).json({ user });
        }
    }
    catch (error) {
        console.error("Error during login:", error);
        next(error);
    }
});
exports.login = login;
//log out from single device
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.cookies.auth_token;
        //@ts-ignore
        const user = yield userModel_1.default.findById(req === null || req === void 0 ? void 0 : req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Remove the current session token from the tokens array
        user.tokens = user.tokens.filter(t => t !== token);
        yield user.save();
        // Clear the auth_token cookie
        res.clearCookie('auth_token');
        res.json({ message: 'Logged out successfully' });
    }
    catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.logout = logout;
const logoutFromAllDevices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //@ts-ignore
        const user = yield userModel_1.default.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Clear all tokens from the user's tokens array
        user.tokens = [];
        yield user.save();
        // Clear the auth_token cookie
        res.clearCookie('auth_token');
        res.json({ message: 'Logged out from all devices' });
    }
    catch (error) {
        console.error("Error during logout from all devices:", error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.logoutFromAllDevices = logoutFromAllDevices;
