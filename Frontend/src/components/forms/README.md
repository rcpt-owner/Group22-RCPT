# Dynamic Forms — Frontend (forms)

Purpose
A concise developer guide for the JSON-driven DynamicForm system used across the RCPT frontend. This document explains how forms are defined, rendered, validated, saved, and extended.

Quick overview
- Forms are described by JSON schemas (FormSchema) and rendered by DynamicForm.
- Validation is generated at runtime with the Zod schema builder (src/utils/zodSchemaBuilder.ts).
- Field rendering is centralized in FieldForm (src/components/forms/DynamicFormField.tsx).
- Mock and production JSON form schemas live in public/api/forms (used during dev).

Where the pieces live
- Schema types: src/types/FormSchema.ts
- Renderer: src/components/forms/DynamicForm.tsx
- Field mapping: src/components/forms/DynamicFormField.tsx
- Zod builder: src/utils/zodSchemaBuilder.ts
- Example JSON forms: public/api/forms/*.json
- Persistence helpers / drafts: rcptEngine (src/features/RCPT/rcptEngine)

How DynamicForm works (runtime flow)
1. Parent passes a FormSchema and optional initialData + projectId to DynamicForm.
2. DynamicForm calls buildFormSchema(fields) to create a Zod object schema for validation.
3. React Hook Form is initialized with zodResolver and defaultValues.
4. DynamicForm hydrates any field options from optionsUrl (remote JSON) and computes dependent select options (optionsMap / dependsOn).
5. Each field is rendered via FieldForm — this maps field.type to a small form primitive component (text, textarea, number, date, select, checkbox, monthYearDate, dynamic_years, repeatable).
6. onChange is emitted (useWatch) for autosave/drafts. The parent may persist drafts (rcptEngine.saveFormData).
7. On submit, DynamicForm runs additional dependent-select validation, toggles saving state, and calls the parent onSubmit.

Important behaviors and features
- Validation
  - All validation metadata is described in FormSchema.validation and translated to Zod in src/utils/zodSchemaBuilder.ts.
  - Cross-field checks (e.g., startDate / endDate span) are implemented in buildFormSchema via superRefine.
- Dynamic options
  - Fields can declare optionsUrl; DynamicForm will fetch and attach options before render.
  - Dependent selects use dependsOn + optionsMap + clearOnParentChange + disableUntilParent to compute allowed child options and optionally clear invalid values.
- Dynamic years
  - Field type "dynamic_years" renders numeric inputs per project year using rcptEngine.getProjectYears(projectId). Useful for multi-year budgets.
- Repeatable groups
  - type "repeatable" supports fields[] and defaultEntry; builder makes them z.array(object(childShape)).default([]).
- Month-year inputs
  - "monthYearDate" normalizes and validates YYYY-MM or MM-YYYY formats; optional/required behavior is handled in the builder.

Saving, drafts & formId
- formId (schema.formId or provided formId prop) uniquely identifies a form instance for drafts and external submit actions.
- Autosave: DynamicForm exposes onChange (called on any field change). Typical usage:
  - Parent supplies onChange={(vals) => rcptEngine.saveFormData(projectId, formId, vals)}
  - rcptEngine stores drafts (project-scoped) so dialogs/pages can prefill.
- Submit: Parent's onSubmit is responsible for persistence (API call). DynamicForm only manages UI saving state and local validation.
- Dialog integration: set hideSubmit to true to hide internal submit and use external dialog buttons that reference the form id.

Adding or modifying forms (JSON)
1. Create or edit: public/api/forms/<your-form>.json
2. Minimal example:
```json
{
  "formId": "add-staff-cost-form",
  "submitLabel": "Add staff",
  "fields": [
    { "name": "role", "type": "text", "label": "Role", "validation": { "required": true } },
    { "name": "employmentType", "type": "select", "label": "Employment type", "options": [{ "value": "full-time", "label": "Full-Time" }] },
    { "name": "years", "type": "dynamic_years", "label": "Costs per year" }
  ]
}
```
3. During dev, DynamicForm fetches files relative to the dev server base — confirm BASE_URL if using a custom prefix.

Extending the system — add a new field type
1. Update FormSchema (src/types/FormSchema.ts) to include the new type in FieldDefinition.
2. Implement UI primitive (e.g., src/components/forms/FormColorInput.tsx).
3. Add a case in FieldForm (src/components/forms/DynamicFormField.tsx) to render the new primitive.
4. Update zodSchemaBuilder.buildFieldSchema to map validation details to the proper Zod schema for the new type.
5. Add tests or manual check JSON files in public/api/forms and exercise via the UI.

Extending validation & cross-field rules
- Modify src/utils/zodSchemaBuilder.ts to add rules or new validation keys.
- Use z.object(...).superRefine to implement multi-field constraints (already used for date spans).

Best practices
- Keep form JSON small and composable (reuse field definitions).
- Use formId consistently so autosave/drafts work across dialogs and pages.
- Prefer optionsUrl when option sets are shared/managed by backend.
- Use dependent selects to avoid fetching large option sets; use optionsMap for small maps.

Troubleshooting
- Empty numeric fields may arrive as "" — builder preprocess handles common cases for numbers.
- If options fail to load, DynamicForm logs an error and falls back to the original field definition.
- If dependent select clears unexpectedly, check clearOnParentChange and optionsMap keys/values.

Commands & quick checks
- Run dev server and view forms:
```bash
cd Frontend
npm install
npm run dev
```
- Add a JSON form and refresh dev UI to see it picked up.

Last updated
2025-10-29

Changelog
- v0.1 — Initial DynamicForm developer guide
