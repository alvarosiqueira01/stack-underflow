import * as dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT ?? '8081',
  mongoUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/stack-underflow',
  jwtSecret: process.env.JWT_SECRET ?? 'change-me-in-production',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
};
