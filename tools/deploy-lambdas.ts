import {
  execSync,
  type ExecSyncOptionsWithStringEncoding,
} from 'child_process';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const args = process.argv.slice(2);
const isPlanOnly = args.includes('--plan-only');
const isAutoApprove = args.includes('--auto-approve');
const isCI = process.env.CI_MODE === 'true';

export default async function deployLambdas() {
  console.log('🔍 Running Terraform plan...');
  const terraformDir = path.resolve(process.cwd(), 'iac/environments/dev');
  const commonOpts: ExecSyncOptionsWithStringEncoding = {
    cwd: terraformDir,
    stdio: 'inherit',
    encoding: 'utf-8',
    env: { ...process.env },
  };

  try {
    execSync('terraform init', commonOpts);
    execSync('terraform plan -out=tfplan', commonOpts);

    if (isPlanOnly) {
      console.log('Plan completed successfully. Skipping apply.');
      return;
    }

    let shouldApply = false;

    if (isAutoApprove) {
      console.log('Auto-approving changes...');
      shouldApply = true;
    } else {
      const answer = await askQuestion(
        'Do you want to apply these changes? (y/n) ',
      );
      shouldApply = answer.toLowerCase() === 'y';
    }

    if (shouldApply) {
      console.log('Applying Terraform changes...');

      execSync('terraform apply tfplan', commonOpts);

      console.log('Deployment completed successfully!');
    } else {
      console.log('Deployment cancelled.');
    }

    execSync('rm -f tfplan', {
      cwd: terraformDir,
    });
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  } finally {
    if (rl) rl.close();
  }
}

const rl =
  !isCI && !isAutoApprove
    ? readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })
    : null;

const askQuestion = async (query: string): Promise<string> => {
  if (isCI || isAutoApprove) return 'y';
  if (!rl) return 'n';

  return new Promise((resolve) => {
    rl?.question(query, resolve);
  });
};

const isRunningDirectly = process.argv[1] === fileURLToPath(import.meta.url);

if (isRunningDirectly) {
  deployLambdas();
}
