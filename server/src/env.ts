// Environment variable validation

import dotenv from 'dotenv';

dotenv.config();

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
}

// Singleton instance
let envConfig: EnvConfig | null = null;

export function validateEnv(): EnvConfig {
  if (envConfig) {
    return envConfig;
  }

  const errors: string[] = [];

  const NODE_ENV = process.env.NODE_ENV || 'development';
  const PORT = parseInt(process.env.PORT || '3001', 10);
  const DATABASE_URL = process.env.DATABASE_URL;
  const JWT_SECRET = process.env.JWT_SECRET;

  // Validate required variables
  if (!DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  } else {
    // Basic validation for DATABASE_URL format
    try {
      const url = new URL(DATABASE_URL);
      if (!url.protocol.includes('postgres')) {
        errors.push('DATABASE_URL must be a PostgreSQL connection string');
      }
    } catch {
      errors.push('DATABASE_URL must be a valid URL');
    }
  }

  if (!JWT_SECRET) {
    errors.push('JWT_SECRET is required');
  } else if (JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters for security');
  } else if (JWT_SECRET === 'dev-secret-change-in-production' && NODE_ENV === 'production') {
    errors.push('JWT_SECRET must be changed from the default value in production');
  }

  // Validate PORT
  if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
    errors.push('PORT must be a valid port number (1-65535)');
  }

  // Validate NODE_ENV
  if (!['development', 'production', 'test'].includes(NODE_ENV)) {
    errors.push('NODE_ENV must be one of: development, production, test');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  envConfig = {
    NODE_ENV,
    PORT,
    DATABASE_URL: DATABASE_URL!,
    JWT_SECRET: JWT_SECRET!,
  };

  return envConfig;
}
