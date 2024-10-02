// middleware/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/userModel';


dotenv.config();

interface AuthRequest extends Request {
    user?: any;
}

const authMiddleware = async(req: AuthRequest, res: Response, next: NextFunction) => {

    const token = req.cookies.auth_token;
    console.log('Token: authMiddleware', token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('Decoded token:', decoded);

    if (!token) {
        return res.status(401).json({ message: 'Authorization token missing or malformed' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
        console.log('Decoded token:', decoded);
        //@ts-ignore
        const user = await User.findById(decoded.id);
        if (!user || !user.tokens.includes(token)) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        req.user = decoded;
        console.log('User:', req.user);
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


const adminMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log('req body:', req.body);
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    next();
};

export { authMiddleware, adminMiddleware };
