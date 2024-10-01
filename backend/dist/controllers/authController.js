"use strict";
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
exports.login = exports.register = exports.logout = void 0;
const jwt_1 = require("../utils/jwt");
const predefinedEmailModel_1 = __importDefault(require("../models/predefinedEmailModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const userService_1 = require("../services/userService");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        //check-for predefined email
        const predefinedEmail = yield predefinedEmailModel_1.default.findOne({ email });
        if (!predefinedEmail) {
            return res.status(400).json({ message: 'Email not authorized for registration' });
        }
        // Check if user already exists
        const existingUser = yield userModel_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const user = yield (0, userService_1.registerUser)(email, password);
        const token = (0, jwt_1.generateToken)({ id: user._id });
        res.cookie('auth_token', token, { httpOnly: true });
        res.status(201).json({ user, token });
    }
    catch (error) {
        next(error);
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const result = yield (0, userService_1.authenticateUser)(email, password);
        if ('isMatch' in result) {
            // result is now known to be of type {isMatch: boolean, message: string}
            if (!result.isMatch) {
                return res.status(401).json({ message: result.message });
            }
        }
        else {
            // result is now known to be of type IUser
            const token = (0, jwt_1.generateToken)({ id: result._id });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
            res.status(200).json({ user: result, token });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logged out successfully' });
};
exports.logout = logout;
