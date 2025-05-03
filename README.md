# 🏙️ CivicAction Platform (Portfolio Demo)

**CivicAction** is a modular civic tech platform designed to empower communities through data. This repository showcases the **public-facing and architectural components** of the system, built with a focus on real-world structure, serverless architecture, and responsible design.

> ✅ **Portfolio Note:**  
> This version is a demonstration build intended to highlight technical decision-making, backend architecture, and modular data processing. Some sensitive or potentially abusable features (like automated action dispatchers) are kept private — more info below.

---

## 🔍 TL;DR

- A modular civic data platform designed to process, analyze, and surface local insights (e.g., 311 service data).
- Uses a real-world, scalable architecture with TypeScript, AWS Lambda, and SAM.
- Showcases domain-driven design, separation of concerns, and responsible system structuring.
- Core logic for extractors, report generators, and storage is included — production-tier action systems are kept private.

---

## 🧠 Project Architecture

This project is structured around **clean architecture principles** — separating domain logic, orchestration, infrastructure, and shared utilities.

### 🔧 Technologies Used

- **TypeScript**
- **AWS Lambda (SAM)**
- **Modular project structure**
- **S3 for versioned data storage**
- **Event-driven analysis logic**

---

## 📁 Included in This Repository

- ✅ Domain-driven code organization (`domains/`)
- ✅ Data extractors and analysis pipelines (e.g., city-311)
- ✅ Lambda function handlers (in `entrypoints/`)
- ✅ Shared utilities for storage and data versioning
- ✅ Infrastructure as code via AWS SAM (`template.yaml`)
- ✅ Public-facing interface mockups and UI flows
- ✅ Architecture-focused documentation and comments

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

Built by Francisco Serrano to demonstrate real-world engineering practices, clean architecture, and a passion for civic technology.  
This project blends **data, community insight, and modern infrastructure** into a scalable, responsible tool
