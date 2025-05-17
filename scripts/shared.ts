import { rm, mkdir } from 'fs/promises';
import { resolve } from 'path';

export async function removeDir(dirPath: string) {
  try {
    await rm(dirPath, { recursive: true, force: true });
    console.log(`Removed ${dirPath}`);
  } catch (err) {
    console.error(`Error removing ${dirPath}:`, err);
  }
}

export async function ensureDir(dirPath: string) {
  try {
    await mkdir(dirPath, { recursive: true });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw err;
    }
  }
}



export const outputLambdaDir = resolve(process.cwd(), 'build', 'lambdas');