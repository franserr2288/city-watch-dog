# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for the CivicAction Platform.

## What is an ADR?

An Architecture Decision Record (ADR) is a document that captures an important architectural decision made along with its context and consequences.

## ADR Files

## ADR Files

| Number                                    | Title                                 | Status   | Date       |
| ----------------------------------------- | ------------------------------------- | -------- | ---------- |
| [ADR-000](./adr-000-foundation.md)        | Foundational Architecture Principles  | Accepted | 2025-05-03 |
| [ADR-001](./adr-001-event-driven.md)      | Adoption of Event-Driven Architecture | Accepted | 2025-05-03 |
| [ADR-002](./adr-002-storage.md)           | S3-Based Storage Abstraction          | Accepted | 2025-05-03 |
| [ADR-003](./adr-003-project-structure.md) | Project Structure Reorganization      | Accepted | 2025-05-03 |

## Potential Future ADRs

Topics that may warrant future ADRs:

- Event Schema Design
- Lambda Function Organization
- Analysis Pipeline Structure
- Multi-Source Data Integration Approach
- Error Handling and Recovery Strategy
- Monitoring and Observability Approach

## Creating a New ADR

1. Copy the [template.md](./template.md) file
2. Name it according to our convention: `adr-XXX-title.md` where XXX is the next number in sequence
3. Fill in the template with your decision details
4. Update this index file to add your new ADR

## ADR States

- **Proposed**: A decision that is under discussion
- **Accepted**: A decision that has been accepted and is being implemented
- **Deprecated**: A decision that is no longer relevant but has not been explicitly superseded
- **Superseded**: A decision that has been replaced by a newer decision
