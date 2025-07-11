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

## 📋 Prereqs

- Node.js 18+
- Terraform installed and configured
- AWS credentials configured
- TypeScript

terraform-infra is the profile that i am using
