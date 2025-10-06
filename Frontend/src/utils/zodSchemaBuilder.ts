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
  return z.object(shape)
}
