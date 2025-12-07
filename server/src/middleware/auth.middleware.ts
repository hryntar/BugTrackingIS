import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { UnauthorizedError } from '../utils/httpErrors';
import { UserRole } from '../generated/prisma';

export interface UserContext {
   userId: number;
   email: string;
   role: UserRole;
}

declare global {
   namespace Express {
      interface Request {
         user?: UserContext;
      }
   }
}

export const authenticate = (
   req: Request,
   res: Response,
   next: NextFunction
): void => {
   try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new UnauthorizedError('No token provided');
      }

      const token = authHeader.substring(7);
      const payload = verifyToken(token);

      req.user = {
         userId: payload.userId,
         email: payload.email,
         role: payload.role as UserRole,
      };

      next();
   } catch (error) {
      next(error);
   }
};

export const requireRoles = (...roles: UserRole[]) => {
   return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
         return next(new UnauthorizedError('Authentication required'));
      }

      if (!roles.includes(req.user.role)) {
         return next(
            new UnauthorizedError(`Required role: ${roles.join(' or ')}`)
         );
      }

      next();
   };
};
