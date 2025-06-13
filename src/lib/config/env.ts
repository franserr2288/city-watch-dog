import { ensureEnvLoaded } from './internal/env-loader';

export const getEnvVar = (key: string): string => {
  ensureEnvLoaded();
  const value = process.env[key];
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
};
