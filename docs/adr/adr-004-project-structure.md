# ADR-003: Project Structure Reorganization

## Date

2025-05-03

## Status

Accepted

## Context

As the CivicAction Platform evolved from initial concept to a more mature architecture, we identified opportunities to improve our project structure to better reflect domain-driven design principles and provide clearer architectural boundaries. The original structure had several limitations:

1. The `domains` folder mixed different levels of business concerns
2. Infrastructure code (`template.yaml`) was nested within source code
3. The naming of components did not clearly communicate their purpose in the overall system
4. Entry points were organized by technical function rather than by business domain

We needed a structure that would better support our event-driven architecture and make the system easier to navigate and understand for new contributors.

## Decision Drivers

- Desire to align folder structure more closely with bounded contexts
- Need to separate deployment artifacts from source code
- Goal of making the system architecture immediately apparent from folder names
- Requirement for clear dependency boundaries between components
- Preparation for future growth in complexity

## Considered Options

- Keep existing structure with minor improvements
- Reorganize based on technical layers (controllers, services, repositories)
- Reorganize based on bounded contexts and hexagonal architecture
- Adopt a modular monolith approach with internal packages

## Decision

We decided to reorganize the project structure based on bounded contexts and a ports-and-adapters (hexagonal) architecture approach:

1. Renamed `domains` to `contexts` to better reflect bounded contexts in domain-driven design
2. Created specific context folders:
   - `source-intake` (formerly extractors) - handling data acquisition
   - `signal-engine` (formerly analysis) - processing data and generating signals
   - `action-center` - new context for handling actions triggered by signals
3. Moved infrastructure code to a dedicated `deploy` folder outside of source code
4. Renamed `entrypoints` to `interfaces` to better reflect their role as adapters in hexagonal architecture
5. Renamed `shared/storage` to `shared/storage-client` to clarify its role

## Consequences

### Positive

- Clearer separation of bounded contexts makes the business domains more explicit
- Infrastructure concerns are properly separated from source code
- Component names better reflect their purpose in the system
- Structure supports the event flow from source intake through signal generation to actions
- Easier onboarding for new team members due to self-documenting structure

### Negative

- Short-term effort required to update imports and reorganize code
- Potential for confusion during transition for anyone familiar with the old structure
- Need to update documentation to reflect new organization

### Neutral

- Need to establish conventions for cross-context communication
- May need to evolve further as the system grows

## Implementation

The implementation involved:

1. Creating the new directory structure
2. Moving files to their new locations
3. Updating import paths
4. Ensuring tests continue to pass
5. Updating documentation to reflect new structure

No functional changes were made during this reorganization; it was purely structural.

## References

- Hexagonal Architecture (Ports and Adapters) by Alistair Cockburn
- Domain-Driven Design by Eric Evans
- "Package by Feature, not Layer" - https://phauer.com/2020/package-by-feature/
