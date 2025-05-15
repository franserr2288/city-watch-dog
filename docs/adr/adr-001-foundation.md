# ADR-000: Foundational Architecture Principles

**Date:** 2025-05-03  
**Status:** Accepted

## Context

I wanted a non-tutorial, data-driven project. Civic data felt accessible, so I needed to nail down dataflow, system partitions, and test seams before diving deeper.

## Decision

Start with a simple Python script against the 311 API to sketch out the data model and flow.

## Alternatives Considered

- **Financial/budget data:** Rich but steeper learning curve
- **Other civic APIs:** Similar complexity; 311 has the cleanest schema
- **JS/TS prototype first:** Valuable later, but slower for raw data exploration

## Consequences

- **Positive:**
  - Instant proof-of-concept in Python, which I know well
  - Early visibility into data shape and trends
- **Negative:**
  - Will need a follow-up ADR when I switch to JS/TS or productionize
  - Doesn’t address frontend or deployment concerns yet

## Implementation

1. Write a Python script or a notebook to pull JSON from the 311 API
2. Load into pandas DataFrames and inspect schema
3. Jot down initial insights and next steps for the service design
