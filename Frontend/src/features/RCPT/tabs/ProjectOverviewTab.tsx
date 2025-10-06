// placeholder and example only - replace with real implementation. It shows how importing and using a service might work.
// just hard coded data for now from the api service demo

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { projectService, type ProjectOverview } from "@/services/projectService"

export function ProjectOverviewTab() {
  const { projectId } = useParams<{ projectId: string }>()
  const [data, setData] = useState<ProjectOverview | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!projectId) return
    let cancelled = false
    setLoading(true)
    setError(null)
    projectService
      .getProjectOverview(projectId)
      .then(d => {
        if (!cancelled) setData(d)
      })
      .catch(e => {
        if (!cancelled) setError(e.message || "Failed to load project overview")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [projectId])

  if (!projectId) return <p className="text-sm text-muted-foreground">No project selected.</p>
  if (loading) return <p className="text-sm text-muted-foreground">Loading overview...</p>
  if (error) return <p className="text-sm text-destructive">Error: {error}</p>
  if (!data) return <p className="text-sm text-muted-foreground">No overview data.</p>

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="font-medium">Summary</p>
          <p className="text-muted-foreground">{data.summary || "—"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Info label="Budget" value={formatCurrency(data.budget)} />
          <Info label="Status" value={data.status} />
          <Info label="Last Updated" value={data.lastUpdated} />
          <Info label="Project ID" value={data.projectId} />
        </div>
      </CardContent>
    </Card>
  )
}

function Info({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm">{value}</p>
    </div>
  )
}

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(v)
}
