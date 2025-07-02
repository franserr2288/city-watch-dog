import { config } from 'dotenv';
import { findUpSync } from 'find-up';
import { EnvironmentDetector } from './environment-detector';
import fs from 'fs';
import path from 'path';

let envInitialized = false;

export const ensureEnvLoaded = () => {
  if (envInitialized) return;

  const envFiles = {
    local: '.env.localstack',
    dev: '.env.dev',
  };
  const target = EnvironmentDetector.willTargetLocalstackEndpoints()
    ? 'local'
    : 'dev';

  const fileName = envFiles[target];
  const envsDir = findUpSync('.envs', { type: 'directory' });

  if (envsDir) {
    const envPath = path.join(envsDir, fileName);

    if (fs.existsSync(envPath)) {
      config();
      config({ path: envPath });
    } else {
      console.warn(
        `Found “.envs” at ${envsDir} but no file named ${fileName} inside it.`,
      );
    }
  } else {
    console.warn(
      'No “.envs” folder found in current directory or any parent directories.',
    );
  }

  envInitialized = true;
};
