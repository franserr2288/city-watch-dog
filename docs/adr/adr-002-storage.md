# ADR-002: S3-Based Storage Abstraction

## Date

2025-05-03

## Status

Accepted

## Context

The CivicAction Platform needs to process and analyze data from external municipal sources (e.g., 311 service requests). These external sources have several limitations:

1. Inconsistent availability and potential rate limits
2. Varied data formats and structures
3. Limited historical data retention
4. No guarantees on data immutability (data might be updated or removed)

To build reliable analyses and maintain data integrity, I needed a storage solution that would give us sovereignty over the data while maintaining its historical versions.

## Decision Drivers

- Need for data independence from external sources
- Requirement to maintain historical versions of data
- Desire for a consistent interface across various data types
- Cost considerations for storage at scale
- Need for serverless compatibility

## Considered Options

- Direct API calls to source systems when needed
- Relational database storage (RDS)
- Document database storage (DynamoDB)
- Object storage with versioning (S3)
- Hybrid approach with hot/cold storage tiers

## Decision

I decided to implement a storage abstraction layer using AWS S3 with versioning enabled. This approach:

1. Creates a storage interface (`storage-interface.ts`) that abstracts away the underlying storage mechanism
2. Implements the interface with an S3 client (`s3-client.ts`)
3. Organizes data by domain and source with consistent naming patterns
4. Leverages S3 versioning for maintaining data history
5. Allows for future implementation of different storage backends without changing consumers

## Consequences

### Positive

- Data sovereignty - I maintain our own copy of all source data
- Historical data access even if sources remove or modify data
- Consistent interface for all data access across the application
- Cost-effective storage for large datasets
- Compatible with serverless architecture

### Negative

- Need to manage data synchronization with sources
- Storage costs will scale with data volume
- Must be careful about data retention policies and lifecycle management
- Initial processing overhead when data is first copied

### Neutral

- Need to establish conventions for data organization in S3
- Must consider data format standardization

## Implementation

The storage abstraction is implemented in the `shared/storage` folder:

- `storage-interface.ts` - Defines the contract for storage operations
- `s3-client.ts` - Implements the interface using AWS S3

Extractors store normalized data using this interface, and analyzers read from it.

## References

- AWS S3 Object Versioning: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
- Data Lake Architecture Patterns
