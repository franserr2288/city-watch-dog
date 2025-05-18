import { globSync } from 'fs';
import { rm, mkdir, glob } from 'fs/promises';
import path, { basename, dirname, resolve } from 'path';

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

export function getOutputLocation(_entrypointName?:string): string {
    return outputLambdaDir;
}

export function getOutputFilePath(entrypointName:string ): string {
    return path.join(getOutputLocation(entrypointName), `${entrypointName}-package.zip`);
}


export function getEntryPointName(entrypoint:string): string {
    const parentDir = dirname(entrypoint);
    return basename(parentDir);
}

export function getLambdaEntrypoints():string[] {
  return globSync('src/**/entrypoints/*/handler.ts');
};