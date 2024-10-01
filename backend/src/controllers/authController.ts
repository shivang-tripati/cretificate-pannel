// controllers/authController.ts

import { Request, Response, NextFunction } from "express";
import { generateToken } from "../utils/jwt";
import PredefinedEmail from '../models/predefinedEmailModel';
import User, { IUser } from '../models/userModel';
import { registerUser, authenticateUser } from '../services/userService';

// interface IUser {
//     _id: string;
//     email: string;
//     role: string;
//     // Add other user properties as needed
// }


const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Check for predefined email
        const predefinedEmail = await PredefinedEmail.findOne({ email });
        if (!predefinedEmail) {
            return res.status(400).json({ message: 'Email not authorized for registration' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Register the user
        const user = await registerUser(email, password);
        const token = generateToken({ id: user._id, role: user.role });

        // Set the token in an HTTP-only cookie
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
          
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(201).json({ user });
    } catch (error) {
        console.error("Error during registration:", error);
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
      const { email, password } = req.body;

      const result = await authenticateUser(email, password);
      console.log("Authentication result:", result);

      if ('isMatch' in result && !result.isMatch) {
          return res.status(401).json({ message: result.message });
      }

      if ('user' in result) {
          const user = result.user as IUser;
          const token = generateToken({ id: user._id, role: user.role });
          user?.tokens.push(token);
          await user.save();

          // Set the token in an HTTP-only cookie
          res.cookie('auth_token', token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              maxAge: 24 * 60 * 60 * 1000, // 1 day
          });
          res.status(200).json({ user });
      }
  } catch (error) {
      console.error("Error during login:", error);
      next(error);
  }
};


//log out from single device
const logout = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.auth_token;
        //@ts-ignore
        const user = await User.findById(req?.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove the current session token from the tokens array
        user.tokens = user.tokens.filter(t => t !== token);
        await user.save();

        // Clear the auth_token cookie
        res.clearCookie('auth_token');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: 'Server error' });
    }
};

const logoutFromAllDevices = async (req: Request, res: Response) => {
    try {
        //@ts-ignore
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Clear all tokens from the user's tokens array
        user.tokens = [];
        await user.save();

        // Clear the auth_token cookie
        res.clearCookie('auth_token');
        res.json({ message: 'Logged out from all devices' });
    } catch (error) {
        console.error("Error during logout from all devices:", error);
        res.status(500).json({ message: 'Server error' });
    }
};



export { register, login, logout, logoutFromAllDevices };
