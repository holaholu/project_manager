import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

interface JwtPayload {
  id: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        // Get token from header
        token = req.headers.authorization.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
          res.status(401).json({ message: 'User not found' });
          return;
        }
        req.user = user;

        next();
      } catch (error) {
        res.status(401).json({ message: 'Not authorized' });
      }
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token' });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
