"use client"

import { useState, useMemo } from "react"
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

export function DynamicForm({
  schema,
  onSubmit,
  initialData,
  isLoading,
  className,
  card = true
}: DynamicFormProps) {
  // OPTIMISATION:
  // - Consider caching zodSchema by (schema.formId + stable hash of fields) to skip rebuild across mounts.
  // - For very large forms, break into sections and build partial Zod schemas to reduce validation cost.
  // - (TODO) Add "validateOnBlur" / "mode" customisation to reduce synchronous validation pressure.
  // - Introduce debounced autosave (onChange) with dirty field diffing to reduce payload sizes.

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

  // OPTIMISATION:
  // - Virtualise massively long field lists (rare, but possible with repeatable expansions).
  // - Add Suspense boundaries around heavy components (date pickers, selects with large datasets).
  const content = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-6"
        // Future: add role="form" / aria-describedby for form-level summaries
      >
        {schema.fields.map(f => (
          <FieldForm
            key={f.name}
            field={f}
            control={form.control}
          />
        ))}

        {/* OPTIMISATION:
           - Add secondary actions: "Save Draft", "Reset", "Validate Only".
           - Show last autosave timestamp (useRef + state).
        */}
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
