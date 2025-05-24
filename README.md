# LA WATCH DOG

This project is my attempt at making open data useful instead of only living in CSV graveyards. Open data platforms are useful, but don't offer substantive insights.

I built this to create signals (like unfixed potholes beyond the legal time limit). You can't have scalable, actionable systems without domain events for civic data stores.

---

## SUMMARY

- 📥 Ingests civic data (e.g., 311 requests)
- ⚙️ Built with TypeScript + AWS Lambda + Terraform
- 🧩 Modular pipelines for event generation

---

## PROJECT ARCHITECTURE

### Bounded context organization

Each domain (like `source-intake` or `signal-engine`) follows this structure :

- **`/entrypoints/`** – Deployable units
- **`/modules/`** – Domain logic

Optional folder(s):

- **`/config/`** – Config and constants scoped to that domain.

### 📁 Example: `src/source-intake/`

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

---

### 🔧 Technologies Used

- **TypeScript**
- **Terraform**
- **AWS: Lambda, DynamoDB, S3, SNS**

---

## DATA FLOW

The system operates in layers to ensure data integrity and accountability:

### 1. Daily Snapshots (Historical Ledger)

- Pulls complete dataset from 311 API → S3 daily snapshots
- Creates an immutable audit trail of data state over time
- Enables detection of deleted/modified records (e.g., for legal accountability)

### 2. Backfill Layer

- One-time historical ingestion from API → DynamoDB
- Processes records in batches from earliest available date
- Publishes completion checkpoint to Parameter Store

### 3. Change Detection Layer

- Reads last processed date from Parameter Store
- Ingests new records and updates to existing ones
- Maintains current state in DynamoDB for analysis

### 4. Signal Engine (Analysis Layer)

- Run queries against DynamoDB to generate civic insights
- Emits events for downstream consumers
- Examples: overdue repairs, response time disparities, service request patterns

---

## WHY I BUILT THIS

Built by Francisco Serrano. I was born and raised in the greater Los Angeles area, here I did my undergrad and gained my first professional experiences. I was involved in community work throughout HS, but that took a backseat during my college years. Once I finished undergrad, I realized my professional skills were the most valuable thing I could offer my community.

My initial project ideas were interesting downstream consumer applications, but I realized they'd just be UI wrappers over raw data endpoints. To get substantive insights - like potholes outstanding beyond legal limits, or disparities in response times between neighborhoods - each app would need complex queries and analysis. Instead of having every consumer re-implement this (and blowing up the API in the process), I built infrastructure that computes these insights once and emits them as events. Build once and everyone gets to eat.

---

## LICENSE

This project is shared for portfolio purposes. See LICENSE.txt for details.

---
