"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm } from "react-hook-form"
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
  card = true
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
    // OPTIMISATION:
    // - Provide "values" prop when streaming partial data (React 19 feature) to progressively hydrate.
  })

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

  // Fast lookup by name for layout handling.
  const fieldByName = useMemo(() => {
    return new Map(resolvedFields.map((f: any) => [f.name, f]))
  }, [resolvedFields])

  // Wrap parent submit handler to manage local "saving" UI state.
  async function handleSubmit(values: any) {
    // OPTIMISATION:
    // - Compare "values" vs form.getValues() snapshot before sending to avoid redundant API call.
    // - Send PATCH / diff instead of full object (backend can merge).
    setSaving(true)
    try {
      await onSubmit(values) // Delegate persistence upward
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
      >
        {rows.length > 0 ? (
          <>
            {/* Render specified rows as responsive grid with inline columns */}
            {rows.map((row, idx) => {
              const rowFields = row
                .map((name) => fieldByName.get(name))
                .filter(Boolean) as any[]
              const cols = Math.min(Math.max(rowFields.length, 1), 3)
              return (
                <div
                  key={`row-${idx}`}
                  className="grid gap-6"
                  style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
                >
                  {rowFields.map((f) => (
                    <FieldForm key={f.name} field={f} control={form.control} />
                  ))}
                </div>
              )
            })}
            {/* Render remaining fields not included in rows */}
            {resolvedFields
              .filter((f: any) => !rows.flat().includes(f.name))
              .map((f: any) => (
                <FieldForm key={f.name} field={f} control={form.control} />
              ))}
          </>
        ) : (
          // Legacy default: simple vertical list
          resolvedFields.map((f: any) => (
            <FieldForm key={f.name} field={f} control={form.control} />
          ))
        )}

        <FormItem>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : schema.submitLabel}
          </Button>
        </FormItem>
      </form>
    </Form>
  )

  // FUTURE:
  // - (TODO) Support layout override (grid, multi-column) via schema-level layout metadata.
  if (!card) return content
  return <Card className={className || "p-6"}>{content}</Card>
}
