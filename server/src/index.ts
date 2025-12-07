import app from './app';
import { env, validateEnv } from './config/env';
import { getPrismaClient, disconnectPrisma } from './prisma/client';

validateEnv();

const prisma = getPrismaClient();

const server = app.listen(env.port, () => {
   console.log(`Server running on port ${env.port}`);
   console.log(`Environment: ${env.nodeEnv}`);
});

const gracefulShutdown = async (signal: string) => {
   console.log(`\n${signal} received, shutting down gracefully...`);

   server.close(async () => {
      console.log('HTTP server closed');

      await disconnectPrisma();
      console.log('Database connection closed');

      process.exit(0);
   });

   setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
   }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
