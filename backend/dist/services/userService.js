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
exports.getUserById = exports.authenticateUser = exports.registerUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcypt_1 = require("../utils/bcypt");
const registerUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existinguser = yield userModel_1.default.findOne({ email });
    if (existinguser) {
        throw new Error('User already exists');
    }
    const hashedPassword = yield (0, bcypt_1.hashPassword)(password);
    const user = new userModel_1.default({ email, password: hashedPassword });
    yield user.save();
    return user;
});
exports.registerUser = registerUser;
const authenticateUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return { isMatch: false, message: 'User not found' };
    }
    const isMatch = yield (0, bcypt_1.comparePassword)(password, user.password);
    if (!isMatch) {
        return { isMatch: false, message: 'Incorrect password' };
    }
    return user;
});
exports.authenticateUser = authenticateUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return userModel_1.default.findById(id).select('-password'); // exclude password from the response
});
exports.getUserById = getUserById;
