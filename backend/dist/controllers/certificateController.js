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
const certificateService_1 = require("../services/certificateService");
const create = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    try {
        const certificate = yield (0, certificateService_1.createCertificate)(req.body);
        res.status(201).json({ message: 'Certificate created', certificate });
    }
    catch (error) {
        next(error);
    }
});
exports.create = create;
const getOne = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield (0, certificateService_1.getCertificateById)(req.params.id);
        if (!certificate)
            return res.status(404).json({ message: 'Certificate not found' });
        res.status(200).json({ certificate });
    }
    catch (error) {
        next(error);
    }
});
exports.getOne = getOne;
const getAll = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //   const certificates = await getAllCertificates();
        //   res.status(200).json({ certificates });
    }
    catch (error) {
        next(error);
    }
});
exports.getAll = getAll;
const update = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const certificate = yield (0, certificateService_1.updateCertificate)(req.params.id, req.body);
        if (!certificate)
            return res.status(404).json({ message: 'Certificate not found' });
        res.status(200).json({ message: 'Certificate updated', certificate });
    }
    catch (error) {
        next(error);
    }
});
exports.update = update;
const remove = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, certificateService_1.deleteCertificate)(req.params.id);
        res.status(200).json({ message: 'Certificate deleted' });
    }
    catch (error) {
        next(error);
    }
});
exports.remove = remove;
