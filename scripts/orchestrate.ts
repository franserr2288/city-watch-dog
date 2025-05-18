import { fileURLToPath } from 'url';
import buildLambdas from "./build-lambdas";
import deployLambdas from "./deploy-lambdas";
import { getOutputLocation, removeDir } from "./helper";

const args = process.argv.slice(2);
const skipCleanup = args.includes('--skip-cleanup');
const skipBuild = args.includes('--skip-build');
const skipDeploy = args.includes('--skip-deploy');

export default async function buildThenDeployLambdas(): Promise<boolean> {
  try {
    console.log("🚀 Starting build and deploy process...");
    
    if (!skipBuild) {
      console.log("📦 Building Lambda functions...");
      await buildLambdas();
      console.log("✅ Build completed successfully.");
    } else {
      console.log("⏩ Skipping build step as requested.");
    }
    
    if (!skipDeploy) {
      console.log("🔄 Deploying infrastructure...");
      await deployLambdas();
      console.log("✅ Deployment completed successfully.");
    } else {
      console.log("⏩ Skipping deploy step as requested.");
    }
    
    if (!skipCleanup) {
      console.log("🧹 Cleaning up build artifacts...");
      const outputLocation = getOutputLocation();
      await removeDir(outputLocation);
      console.log(`✅ Removed build directory: ${outputLocation}`);
    } else {
      console.log("⏩ Skipping cleanup as requested.");
    }
    
    console.log("✨ Process completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Build and deploy process failed:", error);
    process.exit(1);
  }
}

const isRunningDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (isRunningDirectly) {
  buildThenDeployLambdas();
}