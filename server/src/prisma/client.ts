import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({ connectionString });

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
   if (!prisma) {
      prisma = new PrismaClient({
         adapter,
         log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      });
   }
   return prisma;
};

export const disconnectPrisma = async (): Promise<void> => {
   if (prisma) {
      await prisma.$disconnect();
   }
};
