import { getPrismaClient } from '../../prisma/client';
import { NotFoundError } from '../../utils/httpErrors';
import { UserListFilters, UserResponse } from './user.types';

export class UserService {
   private prisma = getPrismaClient();

   async listUsers(filters?: UserListFilters): Promise<UserResponse[]> {
      const users = await this.prisma.user.findMany({
         where: {
            ...(filters?.role && { role: filters.role }),
            ...(filters?.active !== undefined && { active: filters.active }),
         },
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
         },
         orderBy: {
            name: 'asc',
         },
      });

      return users;
   }

   async getUserById(id: number): Promise<UserResponse> {
      const user = await this.prisma.user.findUnique({
         where: { id },
         select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
         },
      });

      if (!user) {
         throw new NotFoundError('User not found');
      }

      return user;
   }
}
