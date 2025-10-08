# Research Pricing and Costing Tool (RPCT) - Group22

## 🚧 Project Status
This repository is under active development for a University of Melbourne (UoM) client (Research, Innovation & Commercialisation – RIC).  
The `main` branch is a placeholder and is not stable or production-ready.  
All current work occurs on the `dev` branch. Pull from `dev` for the latest implementation.  
Breaking changes, incomplete features, and temporary scaffolding are expected at this stage.

## 📦 Overview
The RPCT replaces a legacy Excel-based costing/pricing workbook used for preparing research project budgets.  
Current pain points: version fragmentation, manual formula errors, limited auditability, no workflow visibility, poor multi-user support, duplication when re-costing, and difficulty exporting consistent outputs.  
The new web-based system centralises logic, enforces validation, supports role-based workflows, enables structured exports (e.g. for grants, pricing justifications), and improves transparency and maintainability.  
Although internally hosted for UoM users, its outputs (cost summaries, pricing breakdowns) can be embedded in grant applications or used in negotiations.

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
2. Switch to development branch:  
   ``` git checkout dev ```
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

Dependencies, environment variables, and Docker images are provisional and will be formalised when architecture stabilises.

## 🗺️ Roadmap

### 🔗 Trello / Issue Reference
Link to the related Trello board: [**Trello Board Group 22**](https://trello.com/b/QYEytkjl/team-22)

### Upcoming To-do
- [ ] Core costing module
- [ ] Pricing module
- [ ] Static implementation
- [ ] Backend integration
- [ ] Export and integrations
- [ ] Stable release on `main`
- [ ] Improvements

(Items will be updated as features progress; initial placeholders.)

## 📄 Project Scope
In-Scope (MVP):
- Cost input (personnel FTE, salaries, non-personnel items, indirects)
- Pricing logic (margin / recovery adjustments)
- Approval workflow (draft → review → approved/final)
- Export (structured costing + summary formats)
- Role-based access & basic notifications
- Reference data management (rates, lookup tables)

Out-of-Scope (Current Phase):
- Full integration with HR/Finance live systems
- Real-time multi-user collaborative editing
- Post-award budget tracking / variance monitoring
- Automated grant submission portals
- Multi0currecny compatibility
- Advanced analytics dashboards
- Multi-language/localisation
- Audit logging & minimal reporting

Under Consideration (TBD):
- API endpoints for external tooling
- Bulk import (CSV → cost lines)
- Advanced scenario simulation (probabilistic costing)
- Integration hooks (future financial system connectors)

---
**Note:**
First iteration README. Content will evolve as architecture, deployment model, and stakeholder requirements are confirmed. For latest implementation details always consult the `dev` branch and project issue tracker.

--- 

> Research Costing and Pricing Tool (RCPT) – A web-based application by Group 22 of COMP30022 for the University of Melbourne’s RIC Office. It supports research project costing and pricing with an intuitive interface, database integration, and collaborative workflows. Developed as part of COMP30022 (IT Project) by Group 22. Repository for internal use only. Do not distribute without permission.