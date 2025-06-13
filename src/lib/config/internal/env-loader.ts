import { config } from 'dotenv';
import { findUpSync } from 'find-up';
import { EnvironmentDetector } from './environment-detector';

let envInitialized = false;

export const ensureEnvLoaded = () => {
  if (envInitialized) return;

  const envs = {
    local: '.env.local',
    dev: '.env.dev',
  };
  const file = EnvironmentDetector.willTargetLocalstackEndpoints()
    ? envs.local
    : envs.dev;
  const envPath = findUpSync(file);

  if (envPath) {
    config(); // base
    config({ path: envPath }); // env specific
  } else {
    console.warn(
      'No .env file found in current directory or any parent directories',
    );
  }

  envInitialized = true;
};
