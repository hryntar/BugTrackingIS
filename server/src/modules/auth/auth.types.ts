import { UserRole } from '../../generated/prisma/client';

export interface RegisterDto {
   name: string;
   email: string;
   password: string;
   role: UserRole;
}

export interface LoginDto {
   email: string;
   password: string;
}

export interface AuthResponse {
   user: {
      id: number;
      name: string;
      email: string;
      role: UserRole;
      active: boolean;
   };
   token: string;
}
