# AWS Lambda CI/CD Pipeline

A streamlined CI/CD pipeline for building, packaging, and deploying AWS Lambda functions using GitHub Actions, esbuild, and Terraform.

## Overview

This pipeline automates the process of:

1. Building Lambda functions with esbuild
2. Packaging Lambda functions as deployment-ready ZIP files
3. Deploying to AWS using Terraform
4. Cleaning up temporary resources

## 📁 Files

- **build-lambdas.ts**: Bundles and zips Lambda functions using esbuild
- **deploy-lambdas.ts**: Handles Terraform deployment with interactive/CI options
- **build-then-deploy-lambdas.ts**: Orchestrates the entire build and deploy process
- **helper.ts**: Provides utility functions for file operations and path management

## 🔧 Project Structure

The pipeline expects Lambda functions to follow this structure:

```
/
├── src/
│   ├── [lambda-name]/
│   │   └── entrypoints/
│   │       └── [handler-name]/
│   │           └── handler.ts    # Main Lambda entry point
│   └── ...
├── build/
│   └── lambdas/                  # Generated output directory
│       └── [lambda-name]-package.zip
└── iac/
    └── environments/
        └── dev/                  # Terraform infrastructure code
```

## ⚙️ Configuration

- Lambda functions are discovered automatically using the glob pattern `src/**/entrypoints/*/handler.ts`
- Deployment targets the `dev` environment by default at `iac/environments/dev`
- Builds are created in the `build/lambdas` directory
- Temporary build files are stored in the `tmp` directory

## 🔑 Command Line Options

| Flag             | Description                                   |
| ---------------- | --------------------------------------------- |
| `--plan-only`    | Execute Terraform plan without applying       |
| `--auto-approve` | Skip interactive approval prompt              |
| `--skip-build`   | Skip the build step (uses existing artifacts) |
| `--skip-deploy`  | Skip the deployment step                      |
| `--skip-cleanup` | Preserve build artifacts after deployment     |

## 📋 Prerequisites

- Node.js 18+
- Terraform installed and configured
- AWS credentials configured
- TypeScript

terraform-infra is the profile that i am using
