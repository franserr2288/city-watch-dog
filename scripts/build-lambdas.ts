import { glob } from 'glob';
import esbuild from "esbuild";
import path from 'node:path';
import { basename, dirname, resolve } from 'node:path';
import zipdir from 'zip-dir';
import { removeDir,  outputLambdaDir,  ensureDir, getOutputLocation, getOutputFilePath, getEntryPointName } from './shared.ts';


async function buildLambdas() {
  try {
    const tempLambdaDir = resolve(process.cwd(), 'tmp', 'lambdas');
    const tempDir = resolve(process.cwd(), 'tmp');

    await removeDir(tempLambdaDir);
    await removeDir(outputLambdaDir);
    
    await ensureDir(tempLambdaDir);
    await ensureDir(outputLambdaDir);
    
    const entrypoints = await glob('src/**/entrypoints/*/handler.ts');
    console.log(`Found ${entrypoints.length} Lambda entrypoints`);
    
    await Promise.all(entrypoints.map(async (entryPoint) => {
      const entrypointName = getEntryPointName(entryPoint);
      
      const lambdaTempDir = path.join(tempLambdaDir, entrypointName);
      const lambdaoutputLambdaDir = getOutputLocation(entrypointName);

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
        external: ['aws-sdk', "aws-lambda"],
      });
      
      const zipPath = getOutputFilePath(entrypointName);
      await zipdir(lambdaTempDir, { saveTo: zipPath });
      console.log(`Successfully packaged ${entrypointName}`);
    }));
    
    await removeDir(tempDir);
    console.log('Build completed successfully');
  } catch (e) {
    console.error('Build failed:', e);
    process.exit(1);
  }
}

await buildLambdas();