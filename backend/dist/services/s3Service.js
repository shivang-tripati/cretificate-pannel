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
exports.deleteCertificatePdf = exports.uploadCertificatePdf = void 0;
const s3_1 = __importDefault(require("../config/s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
require('dotenv').config();
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
// Upload PDF to S3
const uploadCertificatePdf = (fileBuffer, fileName, userId, certificateId) => __awaiter(void 0, void 0, void 0, function* () {
    const fileKey = `__certificates/${userId}/${fileName}_${certificateId}.pdf`;
    const uploadParams = {
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: fileBuffer,
        ContentType: 'application/pdf',
    };
    const command = new client_s3_1.PutObjectCommand(uploadParams);
    try {
        const responses = yield s3_1.default.send(command);
        console.log(`File uploaded successfully: ${fileKey}`);
        console.log(`Response: ${JSON.stringify(responses)}`);
        return fileKey; // Return file path for storage in DB
    }
    catch (error) {
        console.error(`Error uploading file: ${error.message}`);
        throw new Error(`S3 upload failed: ${error.message}`);
    }
});
exports.uploadCertificatePdf = uploadCertificatePdf;
// Delete PDF from S3
const deleteCertificatePdf = (pdfKey) => __awaiter(void 0, void 0, void 0, function* () {
    const command = new client_s3_1.DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: pdfKey,
    });
    try {
        yield s3_1.default.send(command);
        console.log(`File deleted successfully: ${pdfKey}`);
    }
    catch (error) {
        console.error(`Error deleting file: ${error.message}`);
        throw new Error(`S3 delete failed: ${error.message}`);
    }
});
exports.deleteCertificatePdf = deleteCertificatePdf;
