import dotenv from 'dotenv';

dotenv.config();

export const env = {
   nodeEnv: process.env.NODE_ENV || 'development',
   port: parseInt(process.env.PORT || '3000', 10),
   databaseUrl: process.env.DATABASE_URL,
   jwtSecret: process.env.JWT_SECRET,
   jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
   githubWebhookSecret: process.env.GITHUB_WEBHOOK_SECRET,
};

export const validateEnv = (): void => {
   const required = ['DATABASE_URL'];
   const missing = required.filter((key) => !process.env[key]);

   if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
   }

   if (env.nodeEnv === 'production' && !env.jwtSecret) {
      throw new Error('JWT_SECRET is required in production');
   }
};
