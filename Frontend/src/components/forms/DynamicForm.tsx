"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Form, FormItem } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import { buildFormSchema } from "@/utils/zodSchemaBuilder"
import type { FormSchema } from "@/types/FormSchema"
import { FieldForm } from "./DynamicFormField"

/**
 * DynamicForm
 * ------------------------------------------------------------------------------------
 * Core generic form renderer. It:
 * 1. Accepts a JSON-derived FormSchema (fields, labels, validation metadata).
 * 2. Builds a runtime Zod schema (via buildFormSchema) for type-safe validation.
 * 3. Initializes React Hook Form with that schema and optional initialData.
 * 4. Renders each field through FieldForm, which centralizes per-type components.
 * 5. Exposes a single onSubmit callback for persistence (API / service integration).
 *
 * Saving & submit handling:
 * - The parent passes `onSubmit` which performs side-effects (API calls, mutations, etc.).
 * - This component only manages UI state: local saving flag + disabling the submit button.
 * - No knowledge of domain services; keeps it reusable for any form context.
 *
 * Extension points:
 * - Add conditional logic or visibility rules inside FieldForm or before render map.
 * - Add layout grouping (steps/sections) by extending schema to include "groups".
 * - Add form-level actions (reset/draft) near the submit button.
 *
 * Important:
 * - Validation changes require only updating JSON + zodSchemaBuilder logic.
 * - New field types require: (1) update FieldDefinition union, (2) implement in FieldForm,
 *   (3) adjust builder if validation shape differs.
 */

type DynamicFormProps = {
  schema: FormSchema                 // JSON-driven schema definition
  onSubmit: (data: any) => Promise<void> | void // Persistence handler (external responsibility)
  initialData?: any                  // Existing data (edit mode)
  isLoading?: boolean                // Optional upstream loading gate
  className?: string                 // Optional wrapper class for Card body
  card?: boolean                     // Toggle Card wrapper (embed vs standalone)
  formId?: string                    // Optional external id to submit from outside
  hideSubmit?: boolean               // Hide internal submit button (use external actions)
  onChange?: (data: any) => void     // emit values on any change
  projectId: string                // projectId for dynamic years
}

// Support optional layout metadata without changing FormSchema type.
type LayoutAwareSchema = FormSchema & {
  layout?: {
    rows?: string[][] // array of rows, each a list of field names
  }
}

export function DynamicForm({
  schema,
  onSubmit,
  initialData,
  isLoading,
  className,
  card = true,
  formId,
  hideSubmit = false,
  onChange, 
  projectId, 
}: DynamicFormProps) {
  const [saving, setSaving] = useState(false)

  // Build + memoize Zod schema from field array.
  // Memo ensures we don't rebuild unless field definitions change.
  const zodSchema = useMemo(() => buildFormSchema(schema.fields), [schema.fields])
  // FUTURE: Move buildFormSchema to a worker thread if schemas become huge.

  // Initialize React Hook Form using dynamic resolver mapping to zodSchema.
  const form = useForm({
    resolver: zodResolver(zodSchema as z.ZodTypeAny),
    defaultValues: initialData || {} 
  })

  // Emit values to parent on any change (autosave / live updates)
  const watchedValues = useWatch({ control: form.control as any })
  useEffect(() => {
    if (onChange) onChange(watchedValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues])

  // Resolve dynamic options from optionsUrl, keeping original order.
  const [resolvedFields, setResolvedFields] = useState(schema.fields)
  useEffect(() => {
    let cancelled = false
    async function fetchJson(url: string) {
      try {
        const res = await fetch(url)
        const data = await res.json()
        return Array.isArray(data) ? data : data?.options ?? []
      } catch (e) {
        console.error("Failed to fetch lookup", url, e)
        return []
      }
    }

    async function hydrateOptions() {
      const updated = await Promise.all(
        schema.fields.map(async (f: any) => {
          // Clone to avoid mutating original schema objects
          const field = { ...f }

          // 1) top-level optionsUrl -> populate field.options
          if (field?.optionsUrl && typeof field.optionsUrl === "string") {
            field.options = await fetchJson(field.optionsUrl)
          }

          // 2) optionsMap entries may reference URLs (string) or objects with optionsUrl
          if (field?.optionsMap && typeof field.optionsMap === "object") {
            const mapEntries = { ...field.optionsMap }
            const keys = Object.keys(mapEntries)
            await Promise.all(
              keys.map(async (k) => {
                const entry = mapEntries[k]
                // entry can be an array of options -> keep as-is
                if (Array.isArray(entry)) return
                // entry can be a URL string to fetch
                if (typeof entry === "string" && entry.length) {
                  mapEntries[k] = await fetchJson(entry)
                  return
                }
                // entry can be object with optionsUrl property
                if (entry && typeof entry === "object" && typeof entry.optionsUrl === "string") {
                  mapEntries[k] = await fetchJson(entry.optionsUrl)
                  return
                }
                // otherwise keep as-is (could be empty / null)
              })
            )
            field.optionsMap = mapEntries
          }

          return field
        })
      )
      if (!cancelled) setResolvedFields(updated)
    }
    hydrateOptions()
    return () => {
      cancelled = true
    }
  }, [schema.fields])

  // Dependent fields: gather any child that depends on a parent field
  const dependentChildren = useMemo(() => {
    return (resolvedFields as any[]).filter((f) => typeof f?.dependsOn === "string")
  }, [resolvedFields])

  // Watch all parent names so UI updates when parents change
  const parentNames = useMemo(
    () => Array.from(new Set(dependentChildren.map((f: any) => f.dependsOn))),
    [dependentChildren]
  )
  const watchedParents = useWatch({
    control: form.control as any,
    name: (parentNames.length ? parentNames : undefined) as any,
  })
  const parentMap = useMemo(() => {
    const map: Record<string, any> = {}
    if (!parentNames.length) return map
    const values = Array.isArray(watchedParents) ? watchedParents : [watchedParents]
    parentNames.forEach((n, i) => {
      map[n] = values[i]
    })
    return map
  }, [parentNames, watchedParents])

  // Build final fields for render: compute options/placeholder/disabled for dependent selects
  const renderFields = useMemo(() => {
    return (resolvedFields as any[]).map((f) => {
      if (f?.type === "select" && f?.dependsOn) {
        const parentVal = parentMap[f.dependsOn]
        const disabled = f.disableUntilParent !== false && !parentVal
        const options = disabled ? [] : (f.optionsMap?.[parentVal] ?? f.options ?? [])
        const placeholder = disabled
          ? (f.placeholderWhenDisabled || f.placeholder || "Select parent first")
          : (f.placeholder ?? "Select")

        return { ...f, options, placeholder, disabled }
      }
      return f
    })
  }, [resolvedFields, parentMap])

  // Fast lookup by name for layout handling (use renderFields, not base fields)
  const fieldByName = useMemo(() => {
    return new Map((renderFields as any[]).map((f: any) => [f.name, f]))
  }, [renderFields])

  // Clear child value if it is no longer valid for the parent
  useEffect(() => {
    // For any dependent child, enforce clear/disable behaviour (selects keep previous specialized handling).
    dependentChildren.forEach((child: any) => {
      const parentVal = parentMap[child.dependsOn]
      const current = (form.getValues() as any)[child.name]
      const clearOnChange = child.clearOnParentChange !== false
      const disableUntilParent = child.disableUntilParent !== false

      if (child.type === "select") {
        const map = child.optionsMap || {}
        const allowed = Array.isArray(map[parentVal]) ? map[parentVal].map((o: any) => o.value) : []
        if (clearOnChange) {
          if (!parentVal && disableUntilParent) {
            if (current) form.setValue(child.name, "")
          } else if (current && allowed.length && !allowed.includes(current)) {
            form.setValue(child.name, "")
          }
        }
      } else {
        // number / dynamic_years / other dependent types:
        if (clearOnChange && !parentVal && disableUntilParent) {
          // clear dependent numeric / record values when parent removed
          form.setValue(child.name, undefined as any)
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parentMap)])

  // -------------------------
  // Runtime dependency validators
  // -------------------------
  const validateDependentNumber = (field: any, values: any) => {
    const parentVal = parentMap[field.dependsOn]
    const childVal = values?.[field.name]
    const rules = field.conditionalValidation?.[parentVal] ?? field.conditionalValidation?.default
    let found = false
    const path = field.name
    // Coerce and validate
    if (childVal == null || childVal === "") {
      // nothing to validate
      form.clearErrors(path)
      return false
    }
    const num = Number(childVal)
    if (Number.isNaN(num)) {
      form.setError(path, { type: "validate", message: rules?.message ?? "Must be a number" } as any)
      return true
    }
    if (rules?.min !== undefined && num < rules.min) {
      form.setError(path, { type: "validate", message: rules.message ?? `Min ${rules.min}` } as any)
      found = true
    }
    if (rules?.max !== undefined && num > rules.max) {
      form.setError(path, { type: "validate", message: rules.message ?? `Max ${rules.max}` } as any)
      found = true
    }
    if (!found) form.clearErrors(path)
    return found
  }

  const validateDynamicYears = (field: any, values: any) => {
    const parentVal = parentMap[field.dependsOn]
    const yearsObj = values?.[field.name] || {}
    if (!yearsObj || typeof yearsObj !== "object") {
      // nothing to validate
      return false
    }
    const rules = field.conditionalValidation ?? {}
    // determine rule set for the current parent value
    const rule = rules[parentVal] ?? rules.default
    // fallback behavior: if no specific rule, infer sensible defaults for common fteType parent values
    const inferred = (() => {
      if (parentVal === "fte" || parentVal === "FTE") return { min: 0, max: 1, message: "For FTE the value must be between 0 and 1." }
      if (parentVal === "daily" || parentVal === "hourly") return { min: 0, message: "For Daily/Hourly the value must be 0 or greater." }
      return null
    })()
    const effective = rule ?? inferred
    let hadError = false
    Object.entries(yearsObj).forEach(([yr, val]) => {
      const path = `${field.name}.${yr}`
      if (val == null || val === "") {
        form.clearErrors(path)
        return
      }
      const num = Number(val)
      if (Number.isNaN(num)) {
        form.setError(path, { type: "validate", message: effective?.message ?? "Must be a number" } as any)
        hadError = true
        return
      }
      if (effective?.min !== undefined && num < effective.min) {
        form.setError(path, { type: "validate", message: effective.message ?? `Min ${effective.min}` } as any)
        hadError = true
        return
      }
      if (effective?.max !== undefined && num > effective.max) {
        form.setError(path, { type: "validate", message: effective.message ?? `Max ${effective.max}` } as any)
        hadError = true
        return
      }
      form.clearErrors(path)
    })
    return hadError
  }

  // Re-validate dependent numeric fields and dynamic_years on parent changes for immediate feedback
  useEffect(() => {
    const values = form.getValues()
    dependentChildren.forEach((child: any) => {
      if (child.type === "number") {
        validateDependentNumber(child, values)
      } else if (child.type === "dynamic_years") {
        validateDynamicYears(child, values)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parentMap)])

  // Wrap parent submit handler to manage local "saving" UI state + dependent validation
  async function handleSubmit(values: any) {
    // Validate dependent selects without changing global zod builder
    // First handle select semantics (keep existing behaviour)
    for (const f of (dependentChildren.filter((c:any)=>c.type === "select") as any[])) {
      const parentVal = values?.[f.dependsOn]
      const childVal = values?.[f.name]
      const map = f.optionsMap || {}
      const allowed = Array.isArray(map[parentVal]) ? map[parentVal].map((o: any) => o.value) : []
      const disableUntilParent = f.disableUntilParent !== false

      if (!parentVal && disableUntilParent && childVal) {
        form.setError(f.name, { type: "validate", message: f.placeholderWhenDisabled || "Select the parent first" } as any)
        return
      }
      if (childVal && allowed.length && !allowed.includes(childVal)) {
        form.setError(f.name, { type: "validate", message: "Invalid selection for the chosen parent" } as any)
        return
      }
    }

    // Validate dependent numeric fields & dynamic_years (centralized runtime validation)
    for (const f of (dependentChildren as any[])) {
      if (f.type === "number") {
        const hadErr = validateDependentNumber(f, values)
        if (hadErr) return
      } else if (f.type === "dynamic_years") {
        const hadErr = validateDynamicYears(f, values)
        if (hadErr) return
      }
    }

    setSaving(true)
    try {
      await onSubmit(values)
    } finally {
      setSaving(false)
    }
  }

  // Upstream gate for async schema/data fetch.
  if (isLoading) return <p>Loading form...</p>

  const layout = (schema as LayoutAwareSchema).layout
  const rows = layout?.rows ?? []

  const content = (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {rows.length > 0 ? (
          <>
            {/* Render specified rows as responsive grid with inline columns */}
            {rows.map((row, idx) => {
              const rowFields = row
                .map((name) => fieldByName.get(name))
                .filter(Boolean) as any[]
              const cols = Math.min(Math.max(rowFields.length, 1), 3)
              return (
                <div key={`row-${idx}`} className="grid gap-6" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                  {rowFields.map((f) => {
                    return (
                      <FieldForm projectId={projectId} key={f.name} field={f} control={form.control} />
                    )
                  })}
                </div>
              )
            })}
            {/* Render remaining fields not included in rows */}
            {renderFields
              .filter((f: any) => !rows.flat().includes(f.name))
              .map((f: any) => {
                return (
                  <FieldForm projectId={projectId} key={f.name} field={f} control={form.control} />
                )
              })}
          </>
        ) : (
          // Legacy default: simple vertical list
          renderFields.map((f: any) => {
            return (
              <FieldForm projectId={projectId} key={f.name} field={f} control={form.control} />
            )
          })
        )}
        {/* internal submit button can be hidden (e.g., when used inside a dialog with external actions) */}
        {!hideSubmit && (
          <FormItem>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : schema.submitLabel}
            </Button>
          </FormItem>
        )}
      </form>
    </Form>
  )

  // FUTURE:
  // - (TODO) Support layout override (grid, multi-column) via schema-level layout metadata.
  if (!card) return content
  return <Card className={className || "p-6"}>{content}</Card>
}
