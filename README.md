# Research Pricing and Costing Tool (RPCT) - Group22

## 🚦 Project status — Stable release (with caveats)
This repository is now published as a stable development release suitable for evaluation and internal use. Many core features are implemented and the application can be used end-to-end in typical scenarios.

Known limitations in this release:
- Caching and some session snapshot behaviour is intentionally minimal or incomplete (see Frontend notes).
- Some resources are still loaded from mock JSON (public/api) rather than the backend for a few form schemas and lookups.
- Staff cost calculation is implemented as a basic summation and does not yet include full business logic (on-costs, rates, complex FTE handling) — treat pricing figures as provisional.
- The backend integration points exist but several API paths remain to be wired/verified in production (see Backend service TODOs below).

Continue to use this branch for stable development; breakages should be rare but please review the "Known limitations" when evaluating outputs.

## 📦 Overview
The RPCT replaces a legacy Excel-based costing/pricing workbook used for preparing research project budgets.  
Core goals remain: accurate costing, flexible pricing, scenario comparisons, simplified export and review workflows.

## 🎯 Objectives
- Accurate research project costing (personnel, non‑personnel, indirects/overheads)
- Flexible pricing (margins, mark‑ups, cost recovery policies)
- Scenario comparison and version control
- Structured approval workflow (applicant → faculty/RIC review → finalisation)
- Role-based access and audit logging
- Export (Excel/PDF/JSON) for submissions and internal reporting
- Accessibility, usability, and reduced error risk
- Foundation for future integrations (HR, finance, grants)

## 👤 Target Users & Stakeholders
Primary:
- Researchers / Grant Applicants
- RIC Administration & Pricing Officers

Secondary / Consulted:
- Faculty research managers
- Finance (overhead rules, rate tables)
- IT / Infrastructure (hosting, SSO)
- Compliance / Governance
- Executive stakeholders (reporting requirements)

## ✨ Key Features (Planned / In Progress)
- Dynamic project form (modular schema-driven fields)
- Personnel & non-personnel cost entry
- Automated indirect cost & on‑cost calculations
- Pricing adjustments (margin, recovery policies)
- Scenario/version management
- Approval & status workflow
- Audit trail (who changed what/when)
- Validation & contextual guidance
- Export: PDF, Excel, machine-readable JSON
- Reporting snapshots (summary, line-item costing)
- Role-based access & permissions
- Notifications (pending approvals, changes requested)
- Reference data / lookup management
- Basic dashboard (recent projects, status indicators)

## 🧰 Development Setup
(Note: early stage; commands will change.)

1. Clone:  
    ```
   git clone https://github.com/maxChiv/Group22-RCPT.git  
   cd Group22-RCPT
   ```
2. Switch to main or dev branch:  
   ``` git checkout main ```
3. Frontend (Vite + React + TypeScript):  
    ```
   cd Frontend  
   npm install  
   npm run dev
   ```
4. Backend (Spring Boot):  
   ``` 
   cd ../Backend  
   ./mvnw spring-boot:run
    ```

Docker (optional):
```bash
# from repo root
docker compose up --build frontend
```

Dependencies, environment variables, and Docker images are provisional and will be formalised when architecture stabilises.

## Stability & Known Limitations (details)
- Caching: The frontend rcptEngine/rcptCache provides a local snapshot mechanism. Some cache behaviours and TTLs are conservative and certain forms still prefer runtime mock merges. Expect improvements in subsequent releases.
- Backend loading: Several form schemas and lookup sets are served from public/api during development. When integrating with production backend, update BASE_URL / VITE_API_BASE_URL and confirm endpoints in src/services/*.
- Staff cost calculation: Current engine does basic per-year aggregation. It does not yet apply institutional rates, on-costs, fringe, or advanced FTE conversion rules. Validate outputs before downstream use.
- Tests & CI: Coverage is limited; more unit/integration tests will be added for the costing and pricing logic.

## 📄 What’s in this repo (key references)
- Frontend app: Frontend/ — React + TypeScript + Vite
  - Frontend README: Frontend/README.md
  - Dynamic Forms guide: Frontend/src/components/forms/README.md
  - Dockerfile for frontend: Docker/frontend.Dockerfile
- Backend services: Backend/ — Spring Boot APIs (domain + controllers)
- Docs & infra: Docker/README.md, CI and config files

Important files (frontend):
- Frontend/src/components/forms/DynamicForm.tsx — JSON-driven form renderer
- Frontend/src/utils/zodSchemaBuilder.ts — runtime Zod builder for form validation
- Frontend/src/features/RCPT/rcptEngine.ts — local engine, persistence mirrors and simple totals
- Frontend/public/api — mock form JSON used in development

## Roadmap (high level)
- Stabilise server-side schema endpoints (swap mock JSON for API)
- Complete caching behaviour and TTL semantics
- Implement full staff cost calculation rules (on-costs, graded rates, time-basis conversions)
- Add more tests around pricing engine and exports
- Harden CI and release process

## How to help / contribute
- Report issues with precise repro steps and expected behaviour
- Add unit tests for rcptEngine totals and zod schema builder
- Replace mock forms in public/api with backend endpoints and update optionsUrl usages
- Implement missing staff cost business rules in Backend and reflect in Frontend totals

## Links & references
- Frontend README: Frontend/README.md
- Backend README: Backend/README.md
- Dynamic Forms guide: Frontend/src/components/forms/README.md
- Docker README: Docker/README.md
- Frontend dynamic schema & validation: Frontend/src/utils/zodSchemaBuilder.ts
- Engine & snapshot logic: Frontend/src/features/RCPT/rcptEngine.ts

Last updated
2025-10-29

---

> Research Costing and Pricing Tool (RCPT) – A web-based application by Group 22 of COMP30022 for the University of Melbourne’s RIC Office. It supports research project costing and pricing with an intuitive interface, database integration, and collaborative workflows. Developed as part of COMP30022 (IT Project) by Group 22. Repository for internal use only. Do not distribute without permission.
