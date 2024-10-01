import {Request, Response, NextFunction} from 'express'

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    
    res.status(statusCode).json({
        message: err.message || 'Internal Server Error',
        // Optionally include stack trace in development
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}

export default errorHandler;
