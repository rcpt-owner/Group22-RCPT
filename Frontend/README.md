# Frontend — RCPT (React + TypeScript + Vite)

One-line summary
A React + TypeScript + Vite frontend for the RCPT project — responsible for the web UI, dynamic JSON-driven forms, and client-side API integration.

Quick start — run locally
Prereqs
- Node.js v16+ (recommended)
- npm or pnpm
- (Optional) Docker / docker-compose for containerized development

Install and run in development:
```bash
# from repo/Frontend
npm install
npm run dev
```

By default Vite serves the app on the dev port defined in vite.config.ts (commonly http://localhost:5173). See [vite.config.ts](vite.config.ts).

Build & production
Build the production bundle:
```bash
npm run build
```
Preview the built output locally:
```bash
npm run preview
```
Note: the production backend/base URL is configured in [src/services/config.ts](src/services/config.ts). Override with environment variables described in the Environment variables section.

Docker
A Dockerfile and compose setup are available for containerized builds and local stacks:
- Dockerfile: `Docker/frontend.Dockerfile`
- Example compose command:
```bash
# from repo root
docker compose up --build frontend
```
If using docker-compose, ensure any backend services referenced by the frontend are also brought up or that you configure appropriate API URLs.

Project structure (key files & folders)
- src/main.tsx — app entrypoint (mount + providers) ([src/main.tsx](src/main.tsx))
- src/App.tsx — root component and router ([src/App.tsx](src/App.tsx))
- src/styles/globals.css — global CSS & Tailwind variables ([src/styles/globals.css](src/styles/globals.css))
- src/components/ — reusable UI and form components
  - src/components/ui/* — shared UI primitives (buttons, inputs, Toaster, ToastProvider)
  - src/components/forms/DynamicForm.tsx — dynamic JSON-driven form renderer ([src/components/forms/DynamicForm.tsx](src/components/forms/DynamicForm.tsx))
  - src/components/forms/DynamicFormField.tsx — per-field renderer and mapping to inputs ([src/components/forms/DynamicFormField.tsx](src/components/forms/DynamicFormField.tsx))
- src/features/RCPT — feature area and core UI for Research Costing Tool ([src/features/RCPT/ResearchCostingTool.tsx](src/features/RCPT/ResearchCostingTool.tsx))
- src/services/ — API clients, config, and helpers:
  - [src/services/config.ts](src/services/config.ts) — base URLs and env-aware config
  - [src/services/projectService.ts](src/services/projectService.ts) — project-related API calls
  - [src/services/firebaseConfig.ts](src/services/firebaseConfig.ts) — Firebase configuration (if used)
- src/utils/zodSchemaBuilder.ts — builds runtime Zod schemas from JSON field schemas
- public/api — mock JSON used during development (forms, fixtures)

Notable helpers
- ToastProvider / Toaster: notification primitives live under `src/components/ui` (e.g., `use-toast.tsx`, `toaster.tsx`).

Environment variables
- The project reads .env files in the conventional Vite way. See the repo-level [.env](.env) for examples.
- Important keys:
  - VITE_API_BASE_URL (or whatever is referenced in [src/services/config.ts](src/services/config.ts))
  - Any Firebase keys used in [src/services/firebaseConfig.ts](src/services/firebaseConfig.ts)
- When running Docker, pass env values via docker-compose or Dockerfile build args as needed.

Tooling & configuration
- Vite config: [vite.config.ts](vite.config.ts)
- Tailwind config: [tailwind.config.js](tailwind.config.js)
- PostCSS: [postcss.config.js](postcss.config.js)
- ESLint: eslint.config.mjs
- TypeScript: tsconfig.json

Testing & linting
- Lint:
```bash
npm run lint
```
- Format:
```bash
npm run format
```
- Tests: There are limited tests at present. Add unit / integration tests under `src/` and wire up test scripts (Jest / Vitest) as needed. Consider adding CI hooks once coverage increases.

Contributing & development notes
- Adding components:
  - Place reusable UI primitives in `src/components/ui`.
  - New feature pages or widgets belong under `src/features/<FeatureName>`.
- Adding forms & schemas:
  - Dynamic JSON form schemas live under `public/api/forms` (used for mock data and can be served in dev).
  - The Dynamic Form system accepts a FormSchema and uses `src/utils/zodSchemaBuilder.ts` to build a Zod schema at runtime. This allows adding new fields by extending the JSON schema and, if necessary, the `FieldDefinition` union and `DynamicFormField` mapping.
- Styling:
  - Follow Tailwind-first rules in `src/styles/globals.css`. Keep component styles within the component or via utility classes.
- Naming conventions:
  - Prefer kebab/feature-based folders for features: `src/features/<feature-name>/…`.
  - Component files: PascalCase and match exported component name.

Why Dynamic Forms?
The `DynamicForm` system was built to allow rapid creation and iteration of forms driven by JSON schemas. Benefits:
- Backend-driven or mock-driven forms without new code per form.
- Single source of validation via Zod builder (`src/utils/zodSchemaBuilder.ts`).
- Centralized rendering & field mapping in `DynamicFormField.tsx` so new input types only require a renderer and optional schema mapping.

Troubleshooting & common issues
- Dev server port conflicts: Vite defaults to 5173. If the port is in use, Vite will prompt — or set PORT env before starting:
```bash
PORT=5174 npm run dev
```
- CORS / backend URL: If the frontend can't reach APIs, verify `VITE_API_BASE_URL` and [src/services/config.ts](src/services/config.ts) point to the correct host and that the backend allows CORS from the dev origin.
- Docker pitfalls: Missing env keys or incorrect network configuration will cause failures. Check docker-compose environment setup and logs (`docker compose logs frontend`).

Links & references
- Repo root README: [../README.md](../README.md)
- Docker README: [Docker/README.md](../Docker/README.md)
- Key files:
  - [vite.config.ts](vite.config.ts)
  - [src/services/config.ts](src/services/config.ts)
  - [src/components/forms/DynamicForm.tsx](src/components/forms/DynamicForm.tsx)
  - [src/utils/zodSchemaBuilder.ts](src/utils/zodSchemaBuilder.ts)
  - [public/api](public/api)

Last updated
2025-10-29

Changelog
- v0.1 — Initial Frontend README (placeholder for future updates)
