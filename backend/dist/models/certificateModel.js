"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const certificateSchema = new mongoose_1.Schema({
    certificateId: { type: String, required: true }, // Corrected typo
    title: { type: String, required: true },
    description: { type: String }, // Optional field for certificate description
    date: { type: Date, default: Date.now }, // Date of issuance
    qrCodeUrl: { type: String, required: true }, // URL to the generated QR code
    s3Url: { type: String, required: true }, // URL to the uploaded PDF
    status: { type: String, default: 'vaild' }, // True for valid, false for invalid
    createdBy: { type: mongoose_1.default.Types.ObjectId, ref: 'User', required: true }, // Creator reference
    updatedBy: [
        {
            userId: { type: mongoose_1.default.Types.ObjectId, ref: 'User' }, // Reference to the user who updated
            updatedAt: { type: Date, default: Date.now }, // Time of update
        },
    ],
}, { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
const Certificate = mongoose_1.default.model('Certificate', certificateSchema);
exports.default = Certificate;
