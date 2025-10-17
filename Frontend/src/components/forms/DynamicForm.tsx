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
    async function hydrateOptions() {
      const updated = await Promise.all(
        schema.fields.map(async (f: any) => {
          if (f?.optionsUrl && typeof f.optionsUrl === "string") {
            try {
              const res = await fetch(f.optionsUrl)
              const data = await res.json()
              const options = Array.isArray(data) ? data : data?.options ?? []
              return { ...f, options }
            } catch (e) {
              console.error("Failed to fetch options for", f.name, e)
              return f
            }
          }
          return f
        })
      )
      if (!cancelled) setResolvedFields(updated)
    }
    hydrateOptions()
    return () => {
      cancelled = true
    }
  }, [schema.fields])

  // Dependent select: gather all child fields that depend on a parent field
  const dependentSelects = useMemo(() => {
    return (resolvedFields as any[]).filter(
      (f) => f?.type === "select" && typeof f?.dependsOn === "string"
    )
  }, [resolvedFields])

  // Watch all parent names so UI updates when parents change
  const parentNames = useMemo(
    () => Array.from(new Set(dependentSelects.map((f: any) => f.dependsOn))),
    [dependentSelects]
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

  // Clear child value if it is no longer valid for the parent
  useEffect(() => {
    dependentSelects.forEach((child: any) => {
      const parentVal = parentMap[child.dependsOn]
      const map = child.optionsMap || {}
      const allowed = Array.isArray(map[parentVal]) ? map[parentVal].map((o: any) => o.value) : []
      const current = (form.getValues() as any)[child.name]
      const clearOnChange = child.clearOnParentChange !== false
      const disableUntilParent = child.disableUntilParent !== false

      if (clearOnChange) {
        if (!parentVal && disableUntilParent) {
          if (current) form.setValue(child.name, "")
        } else if (current && allowed.length && !allowed.includes(current)) {
          form.setValue(child.name, "")
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(parentMap)])

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
    return new Map(renderFields.map((f: any) => [f.name, f]))
  }, [renderFields])

  // Wrap parent submit handler to manage local "saving" UI state + dependent validation
  async function handleSubmit(values: any) {
    // Validate dependent selects without changing global zod builder
    for (const f of dependentSelects as any[]) {
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
                  {rowFields.map((f) => (
                    <FieldForm key={f.name} field={f} control={form.control} />
                  ))}
                </div>
              )
            })}
            {/* Render remaining fields not included in rows */}
            {renderFields
              .filter((f: any) => !rows.flat().includes(f.name))
              .map((f: any) => (
                <FieldForm key={f.name} field={f} control={form.control} />
              ))}
          </>
        ) : (
          // Legacy default: simple vertical list
          renderFields.map((f: any) => (
            <FieldForm key={f.name} field={f} control={form.control} />
          ))
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
