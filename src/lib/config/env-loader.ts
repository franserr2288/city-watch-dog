import dotenv from 'dotenv';
import { findUpSync } from 'find-up';

const envPath = findUpSync('.env');

if (envPath) {
  dotenv.config({ path: envPath });
} else {
  console.warn(
    'No .env file found in current directory or any parent directories',
  );
}

export const getEnvVar = (key: string): string => {
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};
