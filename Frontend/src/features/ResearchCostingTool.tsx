import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ProjectOverviewPage } from "@/pages/ProjectOverviewPage"
import { TabBar } from "@/components/layout/TabBar"
import { ProjectFormPage } from "@/pages/ProjectFormPage"

type WorkspaceTab = "overview" | "staff" | "project-form"

const tabs: { value: WorkspaceTab; label: string; component: React.ComponentType }[] = [
  { value: "overview", label: "Overview", component: ProjectOverviewPage },
  { value: "project-form", label: "Project Form", component: ProjectFormPage },
]

export function ResearchCostingTool({ onExit }: { onExit?: () => void }) {
  const [active, setActive] = useState<WorkspaceTab>("overview")

  return (
    <div className="flex flex-col h-screen">
      {/* Header persists */}
      <header className="flex items-center justify-between h-14 px-6 border-b bg-background">
        <h1 className="text-lg font-semibold">Research Costing Workspace</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded bg-muted">{active}</span>
          {onExit && (
            <Button variant="outline" size="sm" onClick={onExit}>
              Exit
            </Button>
          )}
        </div>
      </header>

      {/* Tab triggers (centered, pill style via TabBar) */}
      <div className="py-4 border-b">
        <TabBar
          tabs={tabs.map(t => t.value)}
          selected={active}
          onChange={t => setActive(t as WorkspaceTab)}
        />
      </div>

      {/* Content area: keep all mounted; toggle visibility with hidden attribute */}
      <div className="flex-1 overflow-auto p-6">
        {tabs.map(t => {
          const C = t.component
          return (
            <div
              key={t.value}
              hidden={active !== t.value}
              data-tab-panel={t.value}
              className="h-full"
            >
              <C />
            </div>
          )
        })}
      </div>
    </div>
  )
}
 