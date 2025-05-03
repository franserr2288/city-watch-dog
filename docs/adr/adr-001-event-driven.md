# ADR-001: Adoption of Event-Driven Architecture

## Date

2025-05-03

## Status

Accepted

## Context

The CivicAction Platform initially started as a monolithic proof-of-concept focused on data sourcing and investigation. As the system evolved, I identified several challenges:

1. The need to decouple data extraction from analysis and action
2. The requirement to process data from external sources I don't control
3. The desire to support multiple types of analysis on the same datasets
4. The goal of creating a system that can scale as I add more data sources and analysis types

I needed an architecture that would allow these processes to operate independently while maintaining clear communication betIen components.

## Decision Drivers

- Desire for loose coupling betIen system components
- Need to handle asynchronous processing of municipal data
- Requirement to trigger multiple types of analysis from the same data changes
- Goal of creating a system that could evolve over time with minimal refactoring
- Limited control over external data sources (city data portals, APIs)

## Considered Options

- Continue with monolithic architecture
- Microservices with direct API calls
- Event-driven architecture with storage abstraction
- Actor model with message passing

## Decision

I decided to implement an event-driven architecture with a dedicated storage abstraction layer. This approach:

1. Uses extractors to fetch and normalize data from external sources
2. Stores normalized data in our own storage (S3 buckets)
3. Triggers analysis based on scheduled jobs and data update events where applicable
4. Emits domain events when significant patterns are detected
5. Allows action handlers to subscribe to these domain events

## Consequences

### Positive

- Components are decoupled and can evolve independently
- New data sources or analysis methods can be added without changing existing code
- The system can scale horizontally as data volume increases
- Storage abstraction provides data sovereignty and reduces dependency on external APIs
- Event-based communication creates a clear audit trail of system activity

### Negative

- Increased complexity compared to monolithic design
- Need to manage event schemas and versioning
- Potential for event handling failures that must be addressed
- Required investment in infrastructure for event processing

### Neutral

- Need to determine appropriate event granularity
- Must establish conventions for event naming and structure

## Implementation

The implementation is organized around domains:

- `domains/extractors` - Responsible for retrieving and normalizing data
- `domains/analysis` - Processes stored data and emits domain events
- `entrypoints` - Lambda handlers that respond to events
- `shared/storage` - Abstraction over S3 for data persistence

Events are defined in domain-specific folders (e.g., `domains/analysis/city-311/events`) and handlers are located in corresponding entrypoint folders.

## References

- Clean Architecture by Robert C. Martin
- Philosophy of Software Design by John Ousterhout
- AWS Event-Driven Architecture: https://aws.amazon.com/event-driven-architecture/
