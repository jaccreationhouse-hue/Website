import dotenv from 'dotenv';

dotenv.config();

function readRequired(name) {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  mongoUri: readRequired('MONGODB_URI'),
  jwtSecret: readRequired('JWT_SECRET'),
  cloudinaryCloudName: readRequired('CLOUDINARY_CLOUD_NAME'),
  cloudinaryApiKey: readRequired('CLOUDINARY_API_KEY'),
  cloudinaryApiSecret: readRequired('CLOUDINARY_API_SECRET'),
  corsOrigins: (process.env.CORS_ORIGINS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
};

export const isProduction = env.nodeEnv === 'production';
