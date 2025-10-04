import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
import { ProjectService } from "@/services/ProjectServiceDemo"
import type { ProjectData } from "@/services/ProjectServiceDemo"

export function ProjectFormPage() {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [initialData, setInitialData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const s = await fetch("/forms/projectForm.json").then(r => r.json())
        setSchema(s)
        const data = await ProjectService.getProjectData()
        setInitialData(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(data: any) {
    await ProjectService.saveProjectData(data as ProjectData)
    console.log("Saved project form:", data)
  }

  if (loading || !schema) return <p>Loading...</p>

 return (
    <div className="p-8 flex justify-center w-full">
      <DynamicForm
        schema={schema}
        initialData={initialData || undefined}
        onSubmit={handleSubmit}
        className="p-8 w-full max-w-3xl"   // widen card
      />
    </div>
  )
}
