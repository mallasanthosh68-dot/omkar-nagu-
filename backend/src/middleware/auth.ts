import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.js';
import { dbStore, UserRecord } from '../config/db.js';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
  tokenPayload?: TokenPayload;
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Authentication required. Please login.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    res.status(401).json({ success: false, message: 'Session expired or invalid token. Please login again.' });
    return;
  }

  let user = await dbStore.findUserById(payload.userId);
  if (!user && payload.role === 'ADMIN') {
    user = await dbStore.getAdminUser();
  }

  if (!user) {
    res.status(401).json({ success: false, message: 'User account not found.' });
    return;
  }

  req.user = user;
  req.tokenPayload = payload;
  next();
};

export const optionalAuth = async (req: AuthenticatedRequest, _res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (payload) {
      const user = await dbStore.findUserById(payload.userId);
      if (user) {
        req.user = user;
        req.tokenPayload = payload;
      }
    }
  }
  next();
};

export const requireAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'ADMIN') {
    res.status(403).json({ success: false, message: 'Access denied. Administrator privileges required.' });
    return;
  }
  next();
};
