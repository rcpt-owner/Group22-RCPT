// placeholder and example only - replace with real implementation. It shows how importing and using a service might work.
// just hard coded data for now from the api service demo

import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { projectService, type ProjectOverview, type ProjectOverviewFormData } from "@/services/projectService"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
import { FileText } from "lucide-react"

export function ProjectOverviewTab() {
  const { projectId } = useParams<{ projectId: string }>()
  const [schema, setSchema] = useState<FormSchema | null>(null)
  const [schemaError, setSchemaError] = useState<string | null>(null)
  const [schemaLoading, setSchemaLoading] = useState(false)

  const [overview, setOverview] = useState<ProjectOverview | null>(null)
  const [dataError, setDataError] = useState<string | null>(null)
  const [dataLoading, setDataLoading] = useState(false)

  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Session key per project (mirror costs tab approach)
  const storageKey = useMemo(() => (projectId ? `rcpt:overview:${projectId}` : ""), [projectId])

  // Load form schema
  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setSchemaLoading(true)
    setSchemaError(null)
    fetch("/forms/projectOverview.schema.json")
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch schema: ${res.status}`)
        return res.json()
      })
      .then((json: FormSchema) => {
        if (!cancelled) setSchema(json)
      })
      .catch(e => {
        if (!cancelled) setSchemaError(e.message || "Failed to load form schema")
      })
      .finally(() => {
        if (!cancelled) setSchemaLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId])

  // Load initial overview data
  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setDataLoading(true)
    setDataError(null)
    projectService
      .getProjectOverview(projectId)
      .then(d => {
        if (!cancelled) setOverview(d)
      })
      .catch(e => {
        if (!cancelled) setDataError(e.message || "Failed to load project overview")
      })
      .finally(() => {
        if (!cancelled) setDataLoading(false)
      })
    return () => { cancelled = true }
  }, [projectId])

  // Map service data to form initial data shape
  function toInitialData(d: ProjectOverview | null): ProjectOverviewFormData {
    return {
      title: d?.title ?? "",
      description: d?.summary ?? "",
      funder: "",
      department: "",
      startDate: "",
      endDate: ""
    }
  }

   // --- TMP - just for dev and will update with API data ---
  // Prefer session values if available
  const initialData: ProjectOverviewFormData | undefined = useMemo(() => {
    if (!projectId) return undefined
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (raw) return JSON.parse(raw) as ProjectOverviewFormData
    } catch {
      // ignore parse errors
    }
    return toInitialData(overview)
  }, [projectId, storageKey, overview])

  // Live title updates with form changes
  const [liveTitle, setLiveTitle] = useState<string>("")
  useEffect(() => {
    if (initialData?.title != null) setLiveTitle(initialData.title)
  }, [initialData?.title])

  async function handleSubmit(values: ProjectOverviewFormData) {
    if (!projectId) return
    // TODO: cross-field validation (endDate >= startDate)
    await projectService.updateProjectOverview(projectId, values)
    setSuccessMsg("Saved")
    setTimeout(() => setSuccessMsg(null), 1500)
  }

  // Autosave to session and update title on any change
  function handleChange(values: ProjectOverviewFormData) {
    if (!storageKey) return
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(values))
    } catch {
      // ignore storage errors
    }
    if (typeof values.title === "string") setLiveTitle(values.title)
  }

  if (!projectId) return <p className="text-sm text-muted-foreground">No project selected.</p>
  if (schemaLoading || dataLoading) return <p className="text-sm text-muted-foreground">Loading overview...</p>
  if (schemaError || dataError) return <p className="text-sm text-destructive">Error: {schemaError || dataError}</p>
  if (!schema) return <p className="text-sm text-destructive">Error: Missing form schema.</p>

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
          <CardTitle className="text-lg">{liveTitle || overview?.title || "Project Overview"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          {successMsg && <p className="text-green-600">{successMsg}</p>}
          <DynamicForm
            schema={schema}
            initialData={initialData}
            onSubmit={handleSubmit}
            onChange={handleChange}
            hideSubmit
            card={false}
            formId="project-overview-form"
          />
        </CardContent>
      </Card>
    </div>
  )
}
