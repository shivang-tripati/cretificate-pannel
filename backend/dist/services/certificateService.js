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
exports.createCertificate = exports.deleteCertificate = exports.updateCertificate = exports.getCertificateById = void 0;
const certificateModel_1 = __importDefault(require("../models/certificateModel"));
const qrCode_1 = require("../utils/qrCode");
const s3Service_1 = require("./s3Service");
const uuid_1 = require("uuid");
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const certificateId = (0, uuid_1.v4)();
const extractPath = (url) => {
    const pathStart = url.indexOf('__certificates');
    if (pathStart !== -1) {
        return url.substring(pathStart + '__certificates/'.length);
    }
    return ''; // return empty if "__certificates" is not found
};
const createCertificate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    (0, s3Service_1.uploadCertificatePdf)(data.file, data.userId);
    const certificateData = Object.assign(Object.assign({}, data), { certificateId: certificateId, qrCodeUrl: yield (0, qrCode_1.generateQRCode)(`https://certificate-pannel.vercel.app/certificate/${data.id}`), pdfUrl: `https://certificate-pannel.s3.amazonaws.com/${BUCKET_NAME}/__certificates/${data.userId}/${data.file.name}.pdf` });
    const certificate = yield certificateModel_1.default.create(certificateData);
    return certificate;
});
exports.createCertificate = createCertificate;
const getCertificateById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield certificateModel_1.default.findById(id);
        return certificate;
    }
    catch (error) {
        console.log(error);
        throw new Error('Certificate not found');
    }
});
exports.getCertificateById = getCertificateById;
const updateCertificate = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    return certificateModel_1.default.findByIdAndUpdate(id, data, { new: true });
});
exports.updateCertificate = updateCertificate;
const deleteCertificate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield getCertificateById(id);
        if (!certificate) {
            throw new Error('Certificate not found');
        }
        yield certificateModel_1.default.findByIdAndDelete(id);
        const pdfUrl = certificate.pdfUrl;
        const pdfKey = extractPath(pdfUrl);
        console.log(pdfKey);
        yield (0, s3Service_1.deleteCertificatePdf)(pdfKey);
    }
    catch (error) {
    }
});
exports.deleteCertificate = deleteCertificate;
