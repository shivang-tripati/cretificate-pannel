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
exports.getAllCertificates = exports.createCertificate = exports.deleteCertificate = exports.updateCertificate = exports.getCertificateById = void 0;
const certificateModel_1 = __importDefault(require("../models/certificateModel"));
const s3Service_1 = require("./s3Service");
require('dotenv').config();
const extractPath = (url) => {
    const pathStart = url.indexOf('__certificates');
    if (pathStart !== -1) {
        return url.substring(pathStart + '__certificates/'.length);
    }
    return ''; // return empty if "__certificates" is not found
};
const createCertificate = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const certificateData = Object.assign({}, data);
    const certificate = yield certificateModel_1.default.create(certificateData);
    return certificate;
});
exports.createCertificate = createCertificate;
const getCertificateById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield certificateModel_1.default.findOne({ certificateId: id });
        console.log(certificate);
        return certificate;
    }
    catch (error) {
        console.error('Error fetching certificate:', error);
        throw new Error('Certificate not found');
    }
});
exports.getCertificateById = getCertificateById;
const updateCertificate = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const certificate = yield getCertificateById(id);
    if (!certificate) {
        throw new Error('Certificate not found');
    }
    return certificateModel_1.default.findByIdAndUpdate(certificate === null || certificate === void 0 ? void 0 : certificate._id, data, { new: true });
});
exports.updateCertificate = updateCertificate;
const deleteCertificate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield getCertificateById(id);
        if (!certificate) {
            throw new Error('Certificate not found');
        }
        yield certificateModel_1.default.findByIdAndDelete(certificate._id);
        const pdfUrl = certificate.s3Url;
        const pdfKey = extractPath(pdfUrl);
        console.log(pdfKey);
        yield (0, s3Service_1.deleteCertificatePdf)(pdfKey);
        return true;
    }
    catch (error) {
        return false;
    }
});
exports.deleteCertificate = deleteCertificate;
const getAllCertificates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificates = yield certificateModel_1.default.find();
        return certificates;
    }
    catch (error) {
        console.error('Error fetching certificates:', error);
        throw new Error('Error fetching certificates');
    }
});
exports.getAllCertificates = getAllCertificates;
