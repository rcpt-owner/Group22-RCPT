import { z } from "zod"
import type { FieldDefinition } from "@/types/FormSchema"

// Apply standard string validation rules based on the field's validation metadata.
function applyCommonStringValidations(schema: z.ZodString, field: FieldDefinition) {
  const v = field.validation
  if (!v) return schema
  if (v.minLength !== undefined) schema = schema.min(v.minLength, `Min ${v.minLength} characters`)
  if (v.maxLength !== undefined) schema = schema.max(v.maxLength, `Max ${v.maxLength} characters`)
  if (v.pattern) schema = schema.regex(new RegExp(v.pattern), "Invalid format")
  if (v.email) schema = schema.email("Invalid email address")
  if (v.url) schema = schema.url("Invalid URL")
  return schema
}

// Apply standard numeric validation rules (min, max) to a Zod number schema.
function applyCommonNumberValidations(schema: z.ZodNumber, field: FieldDefinition) {
  const v = field.validation
  if (!v) return schema
  if (v.min !== undefined) schema = schema.min(v.min, `Min value ${v.min}`)
  if (v.max !== undefined) schema = schema.max(v.max, `Max value ${v.max}`)
  return schema
}

// Dynamically build a Zod schema for a single field based on its type definition.
// Supports nested "repeatable" fields by recursively building child schemas.
export function buildFieldSchema(field: FieldDefinition): z.ZodTypeAny {
  let schema: z.ZodTypeAny
  switch (field.type) {
    case "text":
    case "textarea":
      schema = applyCommonStringValidations(z.string(), field)
      break
    case "number":
      // preprocess to handle empty string -> undefined when optional
      schema = z.preprocess(
        (val) => (val === "" || val === null ? undefined : val),
        applyCommonNumberValidations(z.number({ invalid_type_error: "Must be a number" }), field)
      )
      break
    case "date":
      // store as string (ISO or yyyy-mm-dd)
      schema = z.string().refine(
        (v) => !v || /^\d{4}-\d{2}-\d{2}/.test(v),
        "Invalid date format"
      )
      break
    case "select":
      schema = z.string()
      break
    case "checkbox":
      schema = z.boolean()
      break
    case "repeatable":
      if (!field.fields) {
        schema = z.array(z.any())
        break
      }
      const childShape: Record<string, z.ZodTypeAny> = {}
      field.fields.forEach((f) => {
        childShape[f.name] = buildFieldSchema(f)
      })
      schema = z
        .array(z.object(childShape))
        .default([])
      break
    case "monthYearDate": {
      const base = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Invalid month (YYYY-MM)")
      const normalize = (v: unknown, required: boolean) => {
        if (v === "" || v == null) return required ? "" : undefined
        if (typeof v === "string") {
          const s = v.trim()
          // Accept MM-YYYY and normalize to YYYY-MM
          const mFirst = s.match(/^(0[1-9]|1[0-2])-(\d{4})$/)
          if (mFirst) return `${mFirst[2]}-${mFirst[1]}`
          return s
        }
        return v
      }
      if (field?.validation?.required) {
        return z.preprocess((v) => normalize(v, true), base)
      } else {
        return z.preprocess((v) => normalize(v, false), base.optional())
      }
    }
    default:
      schema = z.any()
  }

  // Optionality (except repeatable arrays which have default)
  if (field.type !== "repeatable" && !field.validation?.required) {
    schema = schema.optional()
  }
  return schema
}

// Build a complete Zod form schema from a list of field definitions.
// Used to validate the entire form dynamically at runtime.
export function buildFormSchema(fields: FieldDefinition[]) {
  const shape: Record<string, z.ZodTypeAny> = {}
  fields.forEach((f) => {
    shape[f.name] = buildFieldSchema(f)
  })
  const obj = z.object(shape)

  // Cross-field rule: if both startDate and endDate exist, enforce max 10-year span (year-only).
  if ("startDate" in shape && "endDate" in shape) {
    return obj.superRefine((data, ctx) => {
      const s = data?.startDate as string | undefined
      const e = data?.endDate as string | undefined
      if (!s || !e) return

      // Helper to extract year and month from common formats: YYYY-MM, YYYY-MM-DD, MM-YYYY
      const parseYearMonth = (val: string) => {
        if (typeof val !== "string") return null
        // YYYY-MM or YYYY-MM-DD
        let m = val.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/)
        if (m) return { year: parseInt(String(m[1]), 10), month: parseInt(String(m[2]), 10) }
        // MM-YYYY
        m = val.match(/^(\d{2})-(\d{4})$/)
        if (m) return { year: parseInt(String(m[2]), 10), month: parseInt(String(m[1]), 10) }
        // Fallback: try to extract 4-digit year anywhere
        const y = val.match(/(\d{4})/)
        if (y) return { year: parseInt(String(y[1]), 10), month: 1 }
        return null
      }

      const start = parseYearMonth(String(s))
      const end = parseYearMonth(String(e))

      if (start && end) {
        // Compare year/month tuples
        const startValue = start.year * 12 + (start.month ?? 1)
        const endValue = end.year * 12 + (end.month ?? 1)
        if (endValue < startValue) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endDate"],
            message: "End date must be the same or after the start date",
          })
          // also return early; still allow other checks to run if desired
          return
        }

        // Existing 10-year span check (year-only); keep this check as well
        if (Math.abs(end.year - start.year) > 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["endDate"],
            message: "Maximum range is 10 years",
          })
        }
      } else {
        // If we could not parse, keep previous behaviour of ignoring the check.
        return
      }
    })
  }

  return obj
}
