"use client"

import { useEffect, useState } from "react"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
import { ProjectService } from "@/services/ProjectServiceDemo"
import type { ProjectData } from "@/services/ProjectServiceDemo"

export function ProjectDynamicFormExample() {
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [initialData, setInitialData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const s: FormSchema = await fetch("/forms/projectForm.json").then(r => r.json())
        setSchema(s)
        const data = await ProjectService.getProjectData()
        setInitialData(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(values: any) {
    await ProjectService.saveProjectData(values as ProjectData)
    console.log("Dynamic project form submitted:", values)
  }

  if (loading || !schema) return <p>Loading dynamic project form...</p>

  return (
    <div className="p-6 flex justify-center">
      <DynamicForm
        schema={schema}
        initialData={initialData || undefined}
        onSubmit={handleSubmit}
        card
      />
    </div>
  )
}
