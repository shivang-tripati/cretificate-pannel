"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
// Multer configuration for file uploads
const storage = multer_1.default.memoryStorage(); // Store files in memory for uploading to S3
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype !== 'application/pdf') {
            return cb(new Error('Only PDFs are allowed')); // Pass the error object as the first argument
        }
        cb(null, true); // Pass null as the first argument, and the result as the second argument
    }
});
exports.default = upload;
