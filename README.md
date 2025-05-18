# 🏙️ CivicAction Platform (Portfolio Demo)

**CivicAction** is a modular civic tech platform designed to empower communities through data. This repository showcases the **public-facing and architectural components** of the system.

> ✅ **Portfolio Note:**  
> This demo showcases my backend and architecture strengths through a civic tech platform built on AWS Lambda, TypeScript, and modular design principles. It reflects real-world decisions around security, scalability, and intuitive code organization.

---

## 📚 Table of Contents

- [🔍 TL;DR](#-tldr)
- [🧠 Project Architecture](#-project-architecture)
- [🔧 Technologies Used](#-technologies-used)
- [🔒 Private Components](#-private-components)
- [🛡️ License](#-license)
- [🙌 Author & Intent](#-author--intent)

---

## 🔍 TL;DR

- 📥 Ingests civic data (e.g., 311 requests)
- ⚙️ Built with TypeScript + AWS Lambda + Terraform
- 🧩 Modular pipelines for event generation

---

## 🧠 Project Architecture

I structured this project with Clean Architecture/DDD in mind, but with a pragmatic spin. Instead of layering each bounded context in a strict hexagonal pattern, I went with **clear, domain-aligned folders** to lower the barrier to entry for onboarding of others but also to make it more approachable for non-technical stakeholders. Considering this is a civic/community minded project trying to make civic data more accessible, that should be reflected in the project organization and architectural intent.

### 🧱 How Each Bounded Context Is Structured

Each major domain (like `source-intake` or `signal-engine`) sticks to a simple pattern:

- **`/interfaces/`** – Shared TypeScript interfaces
- **`/entrypoints/`** – Where the business logic is exposed for standardization of deployments
- **`/modules/`** – All the core domain logic lives here (the "meat" of the domain)

Optional folders:

- **`/config/`** – Config and constants scoped to that domain.
- **`/backfill/`** – One-off scripts to load historical data outside the main daily flow.

### 📁 Example: `src/source-intake/`

```bash
src/source-intake/
├── backfill/             # One-time data backfill scripts
│   └── backfill-city-311.ts
├── config/               # Domain-specific config
│   └── sources.ts
├── entrypoints/          # Lambda handler for 311 ingestion
│   └── city-311/handler.ts
├── interfaces/           # Contract for extractors
│   └── extractor-interface.ts
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
- **AWS Lambda (SAM)**
- **Modular project structure**
- **S3 for versioned data storage**
- **Event-driven analysis logic**

---

## 🛡️ License

This repository is provided for portfolio and demonstration purposes only.  
All rights reserved. Please do not reproduce or deploy without explicit permission. See `LICENSE.txt` for full terms.

---

## 🙌 Author

Built by Francisco Serrano
