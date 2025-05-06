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

- CivicAction processes and analyzes local civic data (e.g., 311 service requests) to produce events that downstream consumers can act on.

- Built with TypeScript + AWS Lambda deployed via SAM IaC

- Includes extractors, signal/event generation, and modular data pipelines — action systems are excluded.

---

## 🧠 Project Architecture

I structured this project with Clean Architecture/DDD in mind, but with a pragmatic spin. Instead of layering each bounded context in a strict hexagonal pattern (which can get abstract fast), I went with **clear, domain-aligned folders** that are easier to navigate — especially for students or devs who haven’t read architecture books.

### Diagram

```mermaid
flowchart TD
  subgraph Source Intake
    SI_Handler[
      Lambda: source-intake
      (handler.ts)
    ]
    SI_Extractor[
      Extractor
      modules/city-311
    ]
    SI_S3[
      S3 Versioned
      Bucket
    ]
  end

  subgraph Signal Engine (Scheduled)
    SE_Scheduler[
      Cron Rules
      (hourly / daily)
    ]
    SE_Handler[
      Lambda: signal-engine
      (entrypoint)
    ]
    SE_Analysis[
      Analysis Modules
      (hourly, daily, etc.)
    ]
    SE_EventBus[
      Event Bus
      (SNS / EventBridge)
    ]
  end

  subgraph Action Center
    AC_Handler[
      Lambda: action-center
      (handlers…)
    ]
    AC_Actions[
      Action Modules
    ]
  end

  SI_Handler --> SI_Extractor --> SI_S3
  SE_Scheduler --> SE_Handler --> SE_Analysis --> SE_EventBus
  SE_EventBus --> AC_Handler --> AC_Actions

```

### 🧱 How Each Bounded Context Is Structured

Each major domain (like `source-intake` or `signal-engine`) sticks to a simple pattern:

- **`/interfaces/`** – Shared TypeScript interfaces to define contracts across modules.
- **`/entrypoints/`** – Where the business logic is exposed to the outside world (Lambda handlers, etc.).
- **`/modules/`** – All the core domain logic lives here — APIs, extractors, transformations, etc.

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

## 🔒 Private Components (Intentionally Excluded)

Some features are kept in a private submodule for security and ethical reasons:

- ❌ Trigger-action engine (e.g., automatic notifications, emails)
- ❌ Sensitive deployment configurations
- ❌ Real-world deployment secrets or keys

If you're a **hiring manager or collaborator** and want to see the full system (including these private components), I'm happy to walk you through it.

📬 Email: **franserr2288@outlook.com**

---

## 🛡️ License

This repository is provided for portfolio and demonstration purposes only.  
All rights reserved. Please do not reproduce or deploy without explicit permission. See `LICENSE.txt` for full terms.

---

## 🙌 Author & Intent

Built by Francisco Serrano to demonstrate real-world engineering practices grounded in production experience, with a focus on clean architecture, civic impact, and system sustainability.
