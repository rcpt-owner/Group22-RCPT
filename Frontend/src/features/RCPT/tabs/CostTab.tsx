"use client"

import { useEffect, useState, useCallback } from "react"
import { DynamicForm } from "../../../components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
import { projectService } from "@/services/projectService"

type CostTabProps = {
  projectId: string
}

export default function CostTab({ projectId }: CostTabProps) {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [initialData, setInitialData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    function buildInitial(cost: any) {
      if (!cost) return null
      const totalDirect =
        typeof cost.totalDirect === "number"
          ? cost.totalDirect
          : (cost.staff || []).reduce((s: number, r: any) => s + (Number(r.cost) || 0), 0)
      const totalIndirect =
        typeof cost.totalIndirect === "number"
          ? cost.totalIndirect
          : totalDirect * (Number(cost.overheadRate) || 0)
      const total =
        typeof cost.total === "number"
          ? cost.total
          : totalDirect + totalIndirect
      return {
        staff: cost.staff || [],
        overheadRate: cost.overheadRate ?? 0,
        totalDirect,
        totalIndirect,
        total
      }
    }

    ;(async () => {
      try {
        const [schemaRes, costData] = await Promise.all([
          fetch("/forms/cost-summary-form.json", { cache: "no-store" }),
          projectService.getCostData(projectId).catch(() => null) // tolerate missing cost file
        ])
        if (!schemaRes.ok) throw new Error(`HTTP ${schemaRes.status}`)
        const json = await schemaRes.json()
        if (!active) return
        setSchema(json)
        setInitialData(buildInitial(costData))
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load cost form")
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [projectId])

  const handleSubmit = useCallback(async (data: any) => {
    // Placeholder: integrate persistence (e.g. POST / PUT) later.
    console.log("Submitted cost summary:", data)
  }, [])

  if (loading) return <p>Loading cost form...</p>
  if (error) return <p className="text-red-600">Error: {error}</p>
  if (!schema) return <p>Form schema unavailable.</p>

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cost Summary</h2>
      <DynamicForm
        schema={schema}
        initialData={initialData || {}}
        onSubmit={handleSubmit}
      />
    </div>
  )
}