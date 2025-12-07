import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { UnauthorizedError } from './httpErrors';

const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as StringValue;

export interface JwtPayload {
   userId: number;
   email: string;
   role: string;
}

export const generateToken = (payload: JwtPayload): string => {
   return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'bugtracker-api',
   });
};

export const verifyToken = (token: string): JwtPayload => {
   try {
      const decoded = jwt.verify(token, JWT_SECRET, {
         issuer: 'bugtracker-api',
      }) as JwtPayload;
      return decoded;
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         throw new UnauthorizedError('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
         throw new UnauthorizedError('Invalid token');
      }
      throw new UnauthorizedError('Token verification failed');
   }
};
