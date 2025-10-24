// placeholder and example only - replace with real implementation. It shows how importing and using a service might work.
// just hard coded data for now from the api service demo

import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
// import { projectService, type ProjectOverview, type ProjectOverviewFormData } from "@/services/projectService"
import { rcptEngine } from "../rcptEngine"
import type { ProjectOverviewFormData } from "@/services/projectService"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
import { FileText } from "lucide-react"

export function ProjectOverviewTab() {
  const { projectId } = useParams<{ projectId: string }>()
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [schemaLoading, setSchemaLoading] = useState(false)

  const [overview, setOverview] = useState<ProjectOverviewFormData | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(false)

  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Load form schema
  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setSchemaLoading(true)
    setSchemaError(null)
    const schemaUrl = new URL('forms/projectOverview.schema.json', window.location.origin).href
    fetch(schemaUrl, { cache: "no-cache" })
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch schema: ${res.status}`)
        return res.json()
      })
      .then((json: FormSchema) => {
        if (cancelled) return
        // Ensure any optionsUrl in the schema is BASE_URL-aware
        const fields = Array.isArray((json as any)?.fields)
          ? (json as any).fields.map((f: any) => {
              if (f && typeof f.optionsUrl === "string") {
                const u = f.optionsUrl as string
                const isHttp = /^https?:\/\//i.test(u)
                const prefixed = isHttp ? u : new URL(u.replace(/^\//, ""), window.location.origin).href
                return { ...f, optionsUrl: prefixed }
              }
              return f
            })
          : (json as any)?.fields
        setSchema({ ...(json as any), fields })
      })
      .catch(e => {
        if (!cancelled) setSchemaError(e.message || "Failed to load form schema")
      })
      .finally(() => {
        if (!cancelled) setSchemaLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId])

  // Load initial overview data via engine
  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setDataLoading(true)
    setDataError(null)
    rcptEngine
      .loadData(projectId)
      .then(() => {
        if (cancelled) return
        setOverview(rcptEngine.getProjectData(projectId)?.overviewFormData ?? null)
      })
      .catch(e => {
        if (!cancelled) setDataError(e?.message || "Failed to load project overview")
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId])

  // Optional: subscribe for cross-tab updates
  useEffect(() => {
    if (!projectId) return
    const unsubscribe = rcptEngine.subscribe(projectId, () => {
      setOverview(rcptEngine.getProjectData(projectId)?.overviewFormData ?? null)
    })
    return unsubscribe
  }, [projectId])

  // Map service data to form initial data shape
  function toInitialData(d: ProjectOverviewFormData | null): ProjectOverviewFormData {
    return {
      title: d?.title ?? "",
      description: d?.description ?? "",
      funder: d?.funder ?? "",
      department: d?.department ?? "",
      startDate: d?.startDate ?? "",
      endDate: d?.endDate ?? ""
    }
  }

  // Prefer form data for initialData; fall back to mapping from overview
  const initialData: ProjectOverviewFormData | undefined = useMemo(() => {
    if (!projectId) return undefined
    // Always prefer cached form data if available
    const formData = rcptEngine.loadFormData<ProjectOverviewFormData>(projectId, "project-overview-form")
    if (formData) return formData
    // Fallback to overview loaded from engine
    return overview ? toInitialData(overview) : undefined
  }, [projectId, overview])

  async function handleSubmit(values: ProjectOverviewFormData) {
    if (!projectId) return
    rcptEngine.saveFormData(projectId, "project-overview-form", values)
    await rcptEngine.refreshCache(projectId) 
    setSuccessMsg("Saved")
    setTimeout(() => setSuccessMsg(null), 1500)
  }

  if (!projectId) return <p className="text-sm text-muted-foreground">No project selected.</p>
  if (schemaLoading || dataLoading) return <p className="text-sm text-muted-foreground">Loading overview...</p>
  if (schemaError || dataError) return <p className="text-sm text-destructive">Error: {schemaError || dataError}</p>
  if (!schema) return <p className="text-sm text-destructive">Error: Missing form schema.</p>
  //if (!initialData) return <p className="text-sm text-muted-foreground">Loading form data...</p>

  return (
    <div className="w-full space-y-6">
      {/* Top Section: Title and description (matches CostTab style) */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <FileText  className="h-6 w-6 " />
            <CardTitle>Project Overview</CardTitle>
          </div>
          <CardDescription>
            Enter the basic details about your research project to get started with cost estimation, and understanding your project requirements.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Bottom Section: Project Overview Form */}
      <Card className="border rounded-lg">
        <CardHeader>
          <CardTitle className="text-lg">{"Project Overview"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {successMsg && <p className="text-green-600">{successMsg}</p>}
          <DynamicForm
            projectId={projectId}
            schema={schema}
            initialData={initialData}
            onSubmit={handleSubmit}
            card={false}
            formId="project-overview-form"
          />
        </CardContent>
      </Card>
    </div>
  )
}
