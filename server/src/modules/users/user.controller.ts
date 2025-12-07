import { Request, Response, NextFunction } from 'express';
import { UserService } from './user.service';
import { ValidationError } from '../../utils/httpErrors';
import { UserRole } from '../../generated/prisma/client';

const userService = new UserService();

export const listUsers = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      const { role, active } = req.query;

      const filters: {
         role?: UserRole;
         active?: boolean;
      } = {};

      if (role) {
         if (!Object.values(UserRole).includes(role as UserRole)) {
            throw new ValidationError('Invalid role filter', {
               validRoles: Object.values(UserRole),
            });
         }
         filters.role = role as UserRole;
      }

      if (active !== undefined) {
         if (active !== 'true' && active !== 'false') {
            throw new ValidationError('Invalid active filter', {
               validValues: ['true', 'false'],
            });
         }
         filters.active = active === 'true';
      }

      const users = await userService.listUsers(filters);

      res.status(200).json(users);
   } catch (error) {
      next(error);
   }
};

export const getUserById = async (
   req: Request,
   res: Response,
   next: NextFunction
): Promise<void> => {
   try {
      const userId = parseInt(req.params.id, 10);

      if (isNaN(userId)) {
         throw new ValidationError('Invalid user ID');
      }

      const user = await userService.getUserById(userId);

      res.status(200).json(user);
   } catch (error) {
      next(error);
   }
};
