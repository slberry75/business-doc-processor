import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import { TokenPayload } from '../types/auth.types';
import logger from '../config/logger';

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

  if (!token) {
    res.status(401).json({ error: 'Access token required' });
    logger.auth('JWT token missing', {
      endpoint: req.path,
      method: req.method,
      clientIp: req.ip,
      userAgent: req.get('user-agent'),
    })
    return;
  }

  try {
    // Verify and decode token
    const decoded = verifyToken(token);
    
    // Add user info to request object
    req.user = decoded;
    
    // Add request-specific context
    logger.auth('Request authorized successfully', {
      userId: decoded.userId,
      endpoint: req.path,
      method: req.method,
      clientIp: req.ip
    });
    // Continue to next middleware/route
    next();
  } catch (error: unknown) {
    res.status(403).json({ error: 'Invalid or expired token' });
    logger.auth('Request authorization failed', {
      endpoint: req.path,
      method: req.method,
      clientIp: req.ip,
      error: error instanceof Error ? error.message : String(error)
    });
    return;
  }
};