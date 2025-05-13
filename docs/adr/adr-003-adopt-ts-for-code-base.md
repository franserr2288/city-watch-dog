# ADR-002: Adopt TypeScript for Codebase

**Date:** 2025-05-12  
**Status:** Accepted

## Context

I want to get more practice with TypeScript and it’s the natural choice if I build a UI later. Using TS now means I’ll have consistent types end-to-end, and save a migration ADR down the road.

## Decision

Standardize on TypeScript for all new modules and Lambda functions.

## Alternatives Considered

- **Plain JavaScript:** Faster to start, but loses type safety and makes future UI integration messier.
- **Python (continue prototype):** Familiar for data work, but harder to share types with a front-end.

## Consequences

- **Positive:**
  - Stronger type guarantees throughout the stack
  - Smooth path to React/Next.js or other TS-based UI
- **Negative:**
  - Slight initial learning curve and build setup
  - Extra compile step for serverless functions
