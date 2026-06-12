import { fileURLToPath } from 'node:url';

export interface ApiEnvironment {
  nodeEnv: string;
  apiPort: number;
  adminOrigin: string;
  publicOrigin: string;
  mongoUri: string;
  mongoDb: string;
  mongoDnsServers: string[];
  accessSecret: string;
  refreshSecret: string;
  accessTtlSeconds: number;
  refreshTtlSeconds: number;
  cloudinaryCloudName: string;
  cloudinaryApiKey: string;
  cloudinaryApiSecret: string;
}

type EnvironmentInput = Record<string, string | undefined>;

function required(input: EnvironmentInput, key: string): string {
  const value = input[key]?.trim();
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
}

function secret(input: EnvironmentInput, key: string, fallback?: string): string {
  const value = input[key]?.trim() || fallback;
  if (!value) {
    throw new Error(`${key} is required`);
  }
  if (value.length < 32) {
    throw new Error(`${key} must contain at least 32 characters`);
  }
  return value;
}

function positiveInteger(input: EnvironmentInput, key: string, fallback: number): number {
  const raw = input[key];
  if (!raw) return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return value;
}

export function loadProjectEnvFile(
  loader: (path: string) => unknown = (path) => process.loadEnvFile(path)
): void {
  loader(fileURLToPath(new URL('../../../../.env', import.meta.url)));
}

export function loadEnv(input: EnvironmentInput = process.env): ApiEnvironment {
  if (input === process.env) {
    try {
      loadProjectEnvFile();
    } catch {
      // A local .env is optional; production values should come from the process environment.
    }
  }

  const nodeEnv = input.NODE_ENV?.trim() || 'development';
  const isProduction = nodeEnv === 'production';

  return {
    nodeEnv,
    apiPort: positiveInteger(input, 'API_PORT', 4000),
    adminOrigin: input.ADMIN_ORIGIN?.trim() || 'http://localhost:3000',
    publicOrigin: input.PUBLIC_ORIGIN?.trim() || 'http://localhost:5173',
    mongoUri: input.MONGODB_URI?.trim() || 'mongodb://127.0.0.1:27017',
    mongoDb: input.MONGODB_DB?.trim() || 'jac_cms',
    mongoDnsServers: (input.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
      .split(',')
      .map((server) => server.trim())
      .filter(Boolean),
    accessSecret: secret(
      input,
      'JWT_ACCESS_SECRET',
      isProduction ? undefined : 'development-access-secret-change-me-1234'
    ),
    refreshSecret: secret(
      input,
      'JWT_REFRESH_SECRET',
      isProduction ? undefined : 'development-refresh-secret-change-me-123'
    ),
    accessTtlSeconds: positiveInteger(input, 'JWT_ACCESS_TTL_SECONDS', 900),
    refreshTtlSeconds: positiveInteger(input, 'JWT_REFRESH_TTL_SECONDS', 2_592_000),
    cloudinaryCloudName: input.CLOUDINARY_CLOUD_NAME?.trim() || 'devxtoev9',
    cloudinaryApiKey: input.CLOUDINARY_API_KEY?.trim() || '',
    cloudinaryApiSecret: input.CLOUDINARY_API_SECRET?.trim() || ''
  };
}
