import esbuild from 'esbuild';
import path from 'node:path';
import { resolve } from 'node:path';
import zipdir from 'zip-dir';
import {
  removeDir,
  outputLambdaDir,
  ensureDir,
  getOutputFilePath,
  getEntryPointName,
  getLambdaEntrypoints,
  getOutputLocation,
} from './helper.ts';
import { fileURLToPath } from 'node:url';

export default async function buildLambdas() {
  try {
    // TODO:  go to root from anywhere you currently are

    const tempLambdaDir = resolve(process.cwd(), 'tmp', 'lambdas');
    const tempDir = resolve(process.cwd(), 'tmp');

    await removeDir(tempLambdaDir);
    await removeDir(outputLambdaDir);

    await ensureDir(tempLambdaDir);
    await ensureDir(outputLambdaDir);

    const entrypoints = getLambdaEntrypoints();
    console.log(`Found ${entrypoints.length} Lambda entrypoints`);

    await Promise.all(
      entrypoints.map(async (entryPoint) => {
        console.log('*******');
        const entrypointName = getEntryPointName(entryPoint);

        const lambdaTempDir = path.join(tempLambdaDir, entrypointName);
        const lambdaoutputLambdaDir = getOutputLocation(entryPoint);

        await ensureDir(lambdaTempDir);
        await ensureDir(lambdaoutputLambdaDir);

        const outputFile = path.join(lambdaTempDir, 'handler.js');
        console.log(`Building ${entrypointName} to ${outputFile}`);

        await esbuild.build({
          entryPoints: [entryPoint],
          bundle: true,
          platform: 'node',
          target: 'node18',
          outfile: outputFile,
          minify: true,
          external: ['aws-sdk', 'aws-lambda'],
        });

        const zipPath = getOutputFilePath(entrypointName);
        await zipdir(lambdaTempDir, { saveTo: zipPath });
        console.log(`Successfully packaged ${entrypointName}`);
      }),
    );

    await removeDir(tempDir);
    console.log('Build completed successfully');
  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

const isRunningDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (isRunningDirectly) {
  buildLambdas();
}
