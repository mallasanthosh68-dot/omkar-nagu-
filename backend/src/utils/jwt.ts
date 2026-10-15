import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'omkar_nagu_electrical_works_secret_key_2026_super_secure';

export interface TokenPayload {
  userId: string;
  phone: string;
  role: 'CUSTOMER' | 'ADMIN';
  name: string;
}

export const signToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};
