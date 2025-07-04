import jwt from 'jsonwebtoken';
import { TokenPayload } from '../types/auth.types';  // Updated import

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};