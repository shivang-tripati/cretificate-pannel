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
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const uuid_1 = require("uuid");
const s3Service_1 = require("../services/s3Service"); // S3 service functions
const qrCode_1 = require("../utils/qrCode");
const certificateService_1 = require("../services/certificateService");
const pdf_lib_1 = require("pdf-lib");
require('dotenv').config();
const AWS_REGION = process.env.AWS_REGION;
const BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const FRONTEND_APP_URL = process.env.FRONTEND_APP_URL;
console.log("FRONTEND_APP_URL", FRONTEND_APP_URL, "BUCKET_NAME", BUCKET_NAME, "AWS_REGION", AWS_REGION);
// Create certificate controller   
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const certificateId = (0, uuid_1.v4)();
    try {
        // 1. Get file and other data from formData
        const { certificateName, status, userId } = req.body;
        const file = req.file; // Assuming file is being uploaded via multer
        if (!file || !certificateName || !status) {
            return res.status(400).json({ message: 'Incomplete form data' });
        }
        //2. qrcode generation
        const verficationLink = `${process.env.FRONTEND_APP_URL}/verify/${certificateId}`; // Construct verification URL
        const qrCodeUrl = yield (0, qrCode_1.generateQRCode)(verficationLink);
        // console.log("qrCodeUrl in certificate controller", qrCodeUrl);
        // 3. proceesed pdf (i.e attach qrcode to pdf)
        const pdfDoc = yield pdf_lib_1.PDFDocument.load(file.buffer);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const qrCodeImage = yield pdfDoc.embedPng(qrCodeUrl);
        const { width, height } = qrCodeImage.size();
        firstPage.drawImage(qrCodeImage, {
            x: firstPage.getWidth() - width - 50, // Adjust position as needed
            y: firstPage.getHeight() - height - 50,
            width: 100, // Adjust size as needed
            height: 100,
        });
        const pdfBytes = yield pdfDoc.save();
        const pdfBuffer = Buffer.from(pdfBytes);
        // 4. Upload file to S3
        const s3FilePath = yield (0, s3Service_1.uploadCertificatePdf)(pdfBuffer, certificateName, userId, certificateId);
        const fileUrl = `https://${BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/${s3FilePath}`;
        // 4. Create certificate object
        const certificateData = {
            certificateId: certificateId,
            title: certificateName,
            description: req.body.description || "", // Optional description
            date: new Date(), // You can modify to use user-supplied date
            qrCodeUrl,
            s3Url: fileUrl,
            status: status,
            createdBy: userId,
            updatedBy: [{
                    userId: userId,
                    updatedAt: new Date(),
                }],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        // 5. Save to database
        const certificate = yield (0, certificateService_1.createCertificate)(certificateData);
        // 6. Return response
        res.status(201).json({ message: 'Certificate created successfully', certificate });
    }
    catch (error) {
        console.error('Error creating certificate:', error);
        next(error);
    }
});
exports.create = create;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.params.id in certificate controller", req.params.id);
    try {
        const data = yield (0, certificateService_1.getCertificateById)(req.params.id);
        if (!data)
            return res.status(404).json({ message: 'Certificate not found' });
        const certificateData = {
            certificateId: data === null || data === void 0 ? void 0 : data.certificateId,
            title: data === null || data === void 0 ? void 0 : data.title,
            s3Url: data === null || data === void 0 ? void 0 : data.s3Url, // Assuming qrCodeUrl is stored in S3 or is equivalent
            qrCodeUrl: data === null || data === void 0 ? void 0 : data.qrCodeUrl,
            status: data === null || data === void 0 ? void 0 : data.status, // Set to true if this certificate is active (or based on your logic)
            issuedDate: data === null || data === void 0 ? void 0 : data.date, // Or createdAt, depending on your preference
            issuedBy: data === null || data === void 0 ? void 0 : data.createdBy
        };
        res.status(200).json({ certificateData });
    }
    catch (error) {
        next(error);
    }
});
exports.getOne = getOne;
// Get all certificates
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificates = yield (0, certificateService_1.getAllCertificates)();
        res.status(200).json({ certificates });
    }
    catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ message: 'Failed to retrieve certificates' });
    }
});
exports.getAll = getAll;
// Update a certificate
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificateId = req.params.id;
        const existingCertificate = yield (0, certificateService_1.getCertificateById)(certificateId);
        if (!existingCertificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        // @ts-ignore
        const user = req === null || req === void 0 ? void 0 : req.user;
        // Ensure updatedBy is an array of objects, and push the new update info
        const updatedData = Object.assign(Object.assign({}, req.body), { updatedBy: [
                ...existingCertificate.updatedBy, // Preserve existing update history
                { userId: user === null || user === void 0 ? void 0 : user._id, updatedAt: new Date() } // Add the new update info
            ] });
        const certificate = yield (0, certificateService_1.updateCertificate)(certificateId, updatedData);
        res.status(200).json({ message: 'Certificate updated successfully', certificate });
    }
    catch (error) {
        console.error('Error updating certificate:', error);
        res.status(500).json({ message: 'Failed to update certificate' });
    }
});
exports.update = update;
// Delete a certificate
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificateId = req.params.id;
        const certificate = yield (0, certificateService_1.getCertificateById)(certificateId);
        if (!certificate) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        const pdfKey = extractCertificatePath(certificate.s3Url);
        pdfKey && (yield (0, s3Service_1.deleteCertificatePdf)(pdfKey));
        const result = yield (0, certificateService_1.deleteCertificate)(certificateId);
        if (!result) {
            return res.status(404).json({ message: 'Certificate not found' });
        }
        res.status(200).json({ message: 'Certificate deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting certificate:', error);
        res.status(500).json({ message: 'Failed to delete certificate' });
    }
});
exports.remove = remove;
const extractCertificatePath = (url) => {
    try {
        const urlObj = new URL(url);
        const pathname = urlObj.pathname;
        // Check if the pathname starts with '__certificates/' and return it
        if (pathname.startsWith('/__certificates/')) {
            return pathname.slice(1); // Remove the leading '/'
        }
        else {
            console.error('URL does not contain the expected certificate path');
            return null;
        }
    }
    catch (error) {
        console.error('Error extracting certificate path from URL:', error);
        return null;
    }
};
