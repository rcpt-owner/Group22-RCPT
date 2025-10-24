// Types describing a JSON-driven form schema.
// These definitions allow forms to be described entirely by data (from a JSON file or API)
// and rendered dynamically without hardcoding field components.

// Common validation rules supported by dynamic forms.
// These will be mapped to Zod validators during runtime schema generation.
export type ValidationRules = {
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: string
  email?: boolean
  url?: boolean
}

// Definition for select field options.
export type OptionDef = { value: string; label: string }

// A single field definition in a dynamic form.
// `type` determines the input (form) component to render.
// `validation` is used to build a runtime Zod schema.
// `fields` and `defaultEntry` are only used for repeatable field arrays.
export type FieldDefinition =
  | {
      name: string
      type: "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "repeatable" | "monthYearDate"
      label: string
      placeholder?: string
      message?: string
      prefix?: string
      options?: OptionDef[]
      validation?: ValidationRules
      // For repeatable fields:
      fields?: FieldDefinition[]
      defaultEntry?: Record<string, any>
      minYear?: number
      maxYear?: number
      defaultValue?: string
      disabled?: boolean
    }

// Definition for a complete dynamic form.
// `formId` is used for identification (e.g. in API calls).
// `fields` is the ordered list of fields to render.
export type FormSchema = {
  formId: string
  submitLabel: string
  fields: FieldDefinition[]
  // OPTIMISATION (future):
  // - Add optional "version" to allow backend to send incremental diffs & clients to cache by (formId+version).
  // - Add "groups" or "sections" to lazy-render large forms (improves first paint).
  // - Add "dependsOn" for conditional visibility (avoid unnecessary re-renders & network requests).
  // - Add "computed" flag for fields whose values come from server functions (not user input).
  // - Add "readOnly"/"permissions" metadata to block edits earlier (prevents wasted validation cycles).
}
