import jwt from 'jsonwebtoken';
import { TokenPayload, FullJWTTokenPayload } from '../types/auth.types';  // Updated import
import logger from '../config/logger'
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): FullJWTTokenPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as FullJWTTokenPayload;
    // Token-specific logging (no request context)
    logger.auth('JWT token decoded successfully', {
      userId: decoded.userId,
      issuedAt: new Date(decoded.iat * 1000).toISOString(),
      expiresAt: new Date(decoded.exp * 1000).toISOString(),
      tokenAge: Date.now() - (decoded.iat * 1000)
    });
    return decoded;
  } catch (error:unknown) {
    if (error instanceof jwt.TokenExpiredError) {
      const expiredPayload = jwt.decode(token) as FullJWTTokenPayload;
      logger.auth('JWT token expired', {
        userId: expiredPayload?.userId,
        expiredAt: new Date(expiredPayload.exp * 1000).toISOString(),
        expiredAgoMs: Date.now() - (expiredPayload.exp * 1000)
      });
    } else {
      logger.auth('JWT token invalid', {
        error: error instanceof Error ? error.message : String(error)
      });
    }
    throw new Error('Invalid or expired token');
  }
};