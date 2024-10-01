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
exports.uploadCertificatePdf = uploadCertificatePdf;
exports.deleteCertificatePdf = deleteCertificatePdf;
const s3_1 = __importDefault(require("../config/s3"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_s3_1 = require("@aws-sdk/client-s3");
dotenv_1.default.config();
function uploadCertificatePdf(file, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_s3_1.PutObjectCommand({
            Bucket: 'plypicker-certificate',
            Key: `__certificates/${userId}/${file.name}.pdf`,
            Body: file,
            ContentType: file.type || 'application/pdf',
            ACL: 'bucket-owner-read'
        });
        try {
            yield s3_1.default.send(command);
            console.log(`${file.name} File uploaded successfully.`);
        }
        catch (error) {
            console.error(`Error uploading file : ${error.message}`);
        }
    });
}
function deleteCertificatePdf(pdfKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: 'plypicker-certificate',
            Key: `__certificates/${pdfKey}`,
        });
        try {
            yield s3_1.default.send(command);
            console.log(`${pdfKey} File deleted successfully.`);
        }
        catch (error) {
            console.error(`Error deleting file : ${error.message}`);
        }
    });
}
