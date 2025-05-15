# ADR-006: Codebase Layout Aligned to Pipeline Slices

**Date:** 2025-05-12  
**Status:** Proposed

## Context

To keep development organized and mirror our infrastructure layout, the code should clearly separate each pipeline phase and shared utilities.

## Decision

Structure `src/` into four top-level folders:

1. **shared/**

   - `api/socrata/` – client and constants for all Socrata calls
   - `config/` – environment loader
   - `data/` – S3 client and shared constants
   - `events/` – base event types and `city-311` events
   - `interfaces/` – cross-slice TypeScript interfaces

2. **source-intake/**

   - `backfill/` – scripts for historical pulls
   - `config/` – source definitions
   - `entrypoints/` – handler functions per dataset
   - `interfaces/` – extractor interface
   - `modules/` – per-dataset extractor logic + common base

3. **signal-engine/**

   - `entrypoints/` – scheduled analysis lambdas
   - `interfaces/` – signal definitions
   - `modules/` – per-dataset analysis logic

4. **action-center/**
   - Consumer code that reacts to published signals

## Alternatives Considered

- **Flat structure:** Quick to start but soon tangled.
- **Monolithic directories:** Hard to isolate and test slices independently.

## Consequences

- **Positive:**
  - Shared code lives in one place, reducing duplication
  - Easier onboarding and parallel development
- **Negative:**
  - Requires adhering to folder conventions
  - Extra boilerplate when adding new slices

## Implementation

1. Create `src/{ shared, source-intake, signal-engine, action-center }`.
2. Move existing modules into respective folders.
3. Update imports/tsconfig paths to match new structure.
