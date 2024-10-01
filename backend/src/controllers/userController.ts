import { Request, Response, NextFunction } from 'express';
import { getUserById } from '../services/userService';

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.id; // Assuming user ID is stored in req.user by auth middleware
      const user = await getUserById(userId);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  };
  
  export { getProfile };