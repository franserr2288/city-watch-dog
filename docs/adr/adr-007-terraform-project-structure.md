# ADR-005: Terraform Project Layout with App-Slices and Modular Boundaries

**Date:** 2025-05-12  
**Status:** Accepted

## Context

As the pipeline grows beyond a single extractor script, I need a Terraform layout that clearly separates each system component, shares common infrastructure cleanly, and supports isolated environments.

## Decision

Organize `iac/` into four top-level directories:

1. **app-slices/** (Aligns closely to `src/`)

   - **shared/**: common infra used by all components (e.g. VPC, IAM roles)
   - **source-intake/**, **signal-engine/**, **action-center/**: one subdirectory per pipeline phase, each defining its own slice of infrastructure

2. **bootstrap/**

   - Bootstraps core resources (remote state bucket, DynamoDB lock table) before anything else runs

3. **modules/**

   - Reusable building blocks (e.g. `s3`, `dynamodb`, `lambda/node`) consumed by the app-slices

4. **environments/**
   - Per-environment overlays (for now only `dev/`), which call into the app-slices and configure backend, providers, and tfvars

## Alternatives Considered

- **Flat repo:** Everything in one folder—simple at first but impossible to maintain as features grow.
- **Monolithic root modules:** Centralized code, but loses the ability to develop and test slices in isolation.

## Consequences

- **Positive:**

  - Clear boundaries: teams (or future me) can work on each slice without touching others
  - Shared infra lives in one place, avoiding duplication
  - Modules enforce consistency across slices
  - Environment overlays orchestrate slices with minimal boilerplate

- **Negative:**
  - Slightly higher upfront complexity in repo structure
  - Requires discipline to keep modules generic and slices focused
