import { globSync } from 'fs';
import { rm, mkdir } from 'fs/promises';
import path, { basename, resolve } from 'path';

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
    await mkdir(dirPath, {
      recursive: true,
    });
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw err;
    }
  }
}

export const outputLambdaDir = resolve(process.cwd(), 'build', 'lambdas');

export function getOutputLocation(_entrypointName?: string): string {
  return outputLambdaDir;
}

export function getOutputFilePath(entrypointName: string): string {
  return path.join(
    getOutputLocation(entrypointName),
    `${entrypointName}-package.zip`,
  );
}

export function getEntryPointName(entrypoint: string): string {
  //const parentDir = dirname(entrypoint);
  console.log('parent dir:');
  return basename(entrypoint);
}

export function getLambdaEntrypoints(): string[] {
  return globSync('src/**/handlers/**.ts');
}
