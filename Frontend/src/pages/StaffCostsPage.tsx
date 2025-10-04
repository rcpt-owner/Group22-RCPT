import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"

export function StaffCostsPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        // OPTIMISATION:
        // - Replace manual fetch with SWR / React Query for caching + stale-while-revalidate.
        // - Preload schema + data in parallel (Promise.all) if data endpoint separate.
        // - Add abort controller for rapid tab switching to avoid race conditions.
        const s = await fetch("/forms/staffCosts.json").then(r => r.json())
        setSchema(s)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(data: any) {
    // FUTURE:
    // - Move to StaffCostsService.save() (encapsulate API + optimistic updates).
    // - Send row-level patch instead of whole payload when diffing arrays.
    console.log("Staff costs submitted:", data)
  }

  if (loading || !schema) return <p>Loading...</p>

  return (
    <div className="p-8 flex justify-center">
      <DynamicForm schema={schema} onSubmit={handleSubmit} />
    </div>
  )
}
