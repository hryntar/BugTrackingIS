import { UserRole } from '../../generated/prisma/client';

export interface UserListFilters {
   role?: UserRole;
   active?: boolean;
}

export interface UserResponse {
   id: number;
   name: string;
   email: string;
   role: UserRole;
   active: boolean;
}
