import { PrismaClient } from '../generated/prisma/client';

let prisma: PrismaClient;

export const getPrismaClient = (): PrismaClient => {
   if (!prisma) {
      prisma = new PrismaClient({
         log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      } as any);
   }
   return prisma;
};

export const disconnectPrisma = async (): Promise<void> => {
   if (prisma) {
      await prisma.$disconnect();
   }
};
