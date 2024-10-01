"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        // Optionally include stack trace in development
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
};
exports.default = errorHandler;
