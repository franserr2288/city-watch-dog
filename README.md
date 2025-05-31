# LA WATCH DOG

Open data is often wasted. We need domain events to make it actionable.

---

## WHAT DOES THIS SOLVE?

LA, like many cities, publishes thousands of 311 service requests daily, but raw data dumps are like having concerts in an empty hall... the people can't hear you.

This system:

- Tracks accountability: Identifies overdue repairs beyond legal time limits
- Reveals patterns: Spots response time disparities across neighborhoods
- Enables automation: Provides clean data feeds for apps, research, and advocacy
- Maintains history: Preserves records even if the city modifies or deletes them

## How It Works

**Data Pipeline**

1. Daily Snapshots → Complete 311 API data pulled daily to S3, creating an immutable audit trail
2. Change Detection → Identifies new records and updates to existing ones, maintains current state in DynamoDB
3. Signal Engine → Runs queries to generate civic insights and emit events for downstream use
4. Historical Backfill → One-time ingestion of historical records

**Why This Architecture**
Rather than forcing every civic app to re-implement data processing (and potentially overwhelm the city's API), this centralizes the heavy lifting once.

## For Developers

### Tech Stack

TypeScript - Type safety for complex data transformations
AWS Lambda + DynamoDB + S3 + SNS - Serverless for operational simplicity
Terraform - Infrastructure as code for reproducible deployments

### Project Structure

Each domain (like `source-intake` or `signal-engine`) follows this structure :

- **`/entrypoints/`** – Deployable units
- **`/modules/`** – Domain logic

Optional folder(s):

- **`/config/`** – Config and constants scoped to that domain.

Example: `src/source-intake/`

```bash
src/source-intake/
├── config/               # Domain-specific config
│   └── sources.ts
├── entrypoints/          # Lambda handler for 311 ingestion
│   └── city-311/handler.ts
├── modules/
│   ├── city-311/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── contract.ts
│   │   │   └── schema.ts
│   │   └── extractor.ts
│   └── common/
│       └── extractor-base.ts
```

### Developer Notes

**Why Serverless?** Development velocity and no infrastructure management overhead for a portfolio project

**Why TypeScript?** Building toward React frontends, wanted end-to-end type safety

**Why Terraform?** Wanted non-AWS-native IaC experience beyond work's SAM exposure

**Why LA 311?** I'm a local, it's an accessible dataset, politically neutral public services, and familiar domain concepts.

## Background & Motivation

Born and raised in LA, I noticed how open data open became background noise with no real uses for it. After doing community work in high school and building technical skills in college/work, I realized I could lay the foundation for other projects I was interested in.

Initial ideas focused on consumer applications, but they would have been doomed to be generic UI wrappers without real insights. Displaying data isn't a hard thing to do - the complexity lies in processing it into actionable intelligence.

This infrastructure solves that problem once, enabling multiple downstream applications without rebuilding the same analysis layer.

## LICENSE

This project is shared for portfolio purposes. See LICENSE.txt for details.
