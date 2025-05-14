# ADR-002: Pipeline Architecture – Source-Intake, Signal-Engine, Action-Center

**Date:** 2025-05-03
**Status:** Proposed

## Context

After prototyping with a flat Python script, the work naturally splits into three stages:

1. **Data Extraction** (fetching raw JSON from Socrata)
2. **Analysis** (deriving signals/trends)
3. **Action** (reacting in real time to insights)

I need a reusable extractor (all Socrata APIs share URL parameter patterns), a pragmatic storage scheme—some endpoints vary by year—and an event layer so downstream consumers can subscribe to analysis results.

## Decision

Structure the pipeline as three decoupled modules:

1. **Source-Intake**

   - A small, reusable extractor library that builds Socrata URLs from config.
   - Dump JSON collections directly into S3 (leveraging my existing S3 expertise).
   - Use a simple key-naming convention (e.g. `/{dataset}/{year}/{timestamp}.json`) to handle year-specific endpoints without metadata stores. Still might need a metadata store.

2. **Signal-Engine**

   - Serverless functions (e.g. AWS Lambda on a schedule) that load raw JSON from S3, run pandas/NumPy -- if I go with python-- analysis, and publish structured “signal” events to an SNS topic.
   - Leaves analysis logic and calling patterns locked in early, while still decoupled from extraction.

3. **Action-Center**
   - Downstream subscribers (SNS → SQS fan-outs or direct Lambda handlers) that react to signals in real time (alerts, dashboards, further pipelines).
   - Event schema TBD once we see the first signals, but SNS provides flexible fan-out.

## Alternatives Considered

- **Monolithic script:** Quick brittle; hard to test in isolation. Horrible to scale
- **Database storage (RDS/Dynamo):** More structured, but higher upfront cost and schema design. Too much research on data/JSON topology for a data-driven platform.
- **Polling instead of events:** Simpler, but loses real-time responsiveness and adds latency.

## Consequences

### Positive

- Clear separation of concerns: extractor, analyst, reactor.
- Storage in S3 locks in minimal dependencies; easy to replay or backfill.
- Event-driven pattern scales naturally and allows real-time actions.

### Negative

- Early commitment to S3 key patterns—will need a migration ADR if we move to a database later.
- Deferring event schema design means I might get painted into an architectural corner, probably not but is possible.

## Implementation

1. Source-intake:
   - Create module
     Stand up shared infra with rest of modules and infra specific to this extraction slice.
