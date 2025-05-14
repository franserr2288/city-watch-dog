# ADR-003: Use Terraform for Infrastructure as Code

**Date:** 2025-05-12  
**Status:** Proposed

## Context

I considered AWS SAM for IAC, but I want a cloud-agnostic solution to keep options open for future non-AWS environments/just to work with something I get less exposure to.

## Decision

Adopt Terraform for all infrastructure provisioning.

## Alternatives Considered

- **AWS SAM:** Tight integration with Lambda and CloudFormation, but locks me into AWS.
- **CloudFormation:** AWS-native but verbose and AWS-only.

## Consequences

- **Positive:**
  - Portable to any cloud provider
  - Large community modules and ecosystem
- **Negative:**
  - Extra dependency on Terraform CLI and state management
  - Must maintain provider plugins and versions
