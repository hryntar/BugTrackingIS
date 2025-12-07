import { getPrismaClient } from '../../prisma/client';
import { hashPassword, comparePassword } from '../../utils/password';
import { generateToken } from '../../utils/jwt';
import {
   BadRequestError,
   UnauthorizedError,
   ConflictError,
   NotFoundError,
} from '../../utils/httpErrors';
import { RegisterDto, LoginDto, AuthResponse } from './auth.types';

export class AuthService {
   private prisma = getPrismaClient();

   async register(data: RegisterDto): Promise<AuthResponse> {
      const existingUser = await this.prisma.user.findUnique({
         where: { email: data.email },
      });

      if (existingUser) {
         throw new ConflictError('Email already registered');
      }

      const passwordHash = await hashPassword(data.password);

      const user = await this.prisma.user.create({
         data: {
            name: data.name,
            email: data.email,
            passwordHash,
            role: data.role,
            active: true,
         },
      });

      const token = generateToken({
         userId: user.id,
         email: user.email,
         role: user.role,
      });

      return {
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
         },
         token,
      };
   }

   async login(data: LoginDto): Promise<AuthResponse> {
      const user = await this.prisma.user.findUnique({
         where: { email: data.email },
      });

      if (!user) {
         throw new UnauthorizedError('Invalid credentials');
      }

      if (!user.active) {
         throw new UnauthorizedError('Account is inactive');
      }

      const isPasswordValid = await comparePassword(data.password, user.passwordHash);

      if (!isPasswordValid) {
         throw new UnauthorizedError('Invalid credentials');
      }

      const token = generateToken({
         userId: user.id,
         email: user.email,
         role: user.role,
      });

      return {
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            active: user.active,
         },
         token,
      };
   }

   async getCurrentUser(userId: number): Promise<AuthResponse['user']> {
      const user = await this.prisma.user.findUnique({
         where: { id: userId },
      });

      if (!user) {
         throw new NotFoundError('User not found');
      }

      return {
         id: user.id,
         name: user.name,
         email: user.email,
         role: user.role,
         active: user.active,
      };
   }
}
