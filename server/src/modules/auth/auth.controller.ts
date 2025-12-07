import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { BadRequestError, ValidationError } from '../../utils/httpErrors';
import { UserRole } from '../../generated/prisma/client';

const authService = new AuthService();

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
         throw new ValidationError('Missing required fields', {
            required: ['name', 'email', 'password', 'role'],
         });
      }

      if (!Object.values(UserRole).includes(role)) {
         throw new ValidationError('Invalid role', {
            validRoles: Object.values(UserRole),
         });
      }

      if (password.length < 6) {
         throw new ValidationError('Password must be at least 6 characters');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         throw new ValidationError('Invalid email format');
      }

      const result = await authService.register({
         name,
         email,
         password,
         role,
      });

      res.status(201).json(result);
   } catch (error) {
      next(error);
   }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
   try {
      const { email, password } = req.body;

      if (!email || !password) {
         throw new ValidationError('Missing required fields', {
            required: ['email', 'password'],
         });
      }

      const result = await authService.login({ email, password });

      res.status(200).json(result);
   } catch (error) {
      next(error);
   }
};

export const getCurrentUser = async (
   req: Request,
   res: Response,
   next: NextFunction,
): Promise<void> => {
   try {
      if (!req.user) {
         throw new BadRequestError('User context not found');
      }

      const user = await authService.getCurrentUser(req.user.userId);

      res.status(200).json({ user });
   } catch (error) {
      next(error);
   }
};
