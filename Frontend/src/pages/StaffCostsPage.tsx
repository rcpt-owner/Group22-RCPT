import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"

export function StaffCostsPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const s = await fetch("/forms/staffCosts.json").then(r => r.json())
        setSchema(s)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(data: any) {
    // Placeholder: integrate with StaffService later
    console.log("Staff costs submitted:", data)
  }

  if (loading || !schema) return <p>Loading...</p>

  return (
    <div className="p-8 flex justify-center">
      <DynamicForm schema={schema} onSubmit={handleSubmit} />
    </div>
  )
}
