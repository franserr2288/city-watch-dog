# ADR-004: Bootstrap Infrastructure with Terraform

**Date:** 2025-05-12  
**Status:** Proposed

## Context

I need an initial Terraform workspace to stand up core resources (S3 bucket for state, IAM roles). Eventually I’ll want remote state, but I need to bootstrap first.

## Decision

Use Terraform to bootstrap the state bucket and IAM. After the initial apply, manually update `backend.tf` to point at the newly created remote backend.

## Alternatives Considered

- **Manual console setup:** Quick but not reproducible.
- **CloudFormation for bootstrap:** Adds another tool chain just for initial resources.

## Consequences

- **Positive:**
  - Fully repeatable bootstrap in code
  - Consistent tool chain from day one
- **Negative:**
  - One manual step to switch `backend.tf` after initial apply
  - Slight risk of drift if backend config isn’t updated immediately

## Implementation

1. Create `iac/bootstrap/main.tf` with S3 bucket and DynamoDB table for locking.
2. Run `terraform init && terraform apply` locally.
