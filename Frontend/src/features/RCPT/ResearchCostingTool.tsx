import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TabBar } from "@/components/layout/TabBar"
import { DemoShowcasePage } from "../DemoSections/DemoShowcasePage"
import { ProjectOverviewTab } from "./tabs/ProjectOverviewTab"
import CostTab from "./tabs/CostTab"


type WorkspaceTab = "Demo Showcase" | "Project Overview" | "Cost" | "Pricing" | "Export"
// type WorkspaceTab = "Demo Showcase" | "Project Setup" | "Costing" | "Review"

const tabs: { value: WorkspaceTab; label: string; component: React.ComponentType<any> }[] = [
  { value: "Demo Showcase", label: "Demo Showcase", component: DemoShowcasePage },
  { value: "Project Overview", label: "Project Overview", component: ProjectOverviewTab },
  { value: "Cost", label: "Cost", component: CostTab },
  { value: "Pricing", label: "Pricing", component: () => <div>Pricing Tab Content (placeholder)</div> },
  { value: "Export", label: "Export", component: () => <div>Export Tab Content (placeholder)</div> },
]

export function ResearchCostingTool({
  onExit,
  // May be used in future tabs when we have real data
  projectId,
  userId,
  initialTab = "Demo Showcase",
}: {
  onExit?: () => void
  projectId?: string
  userId?: string
  initialTab?: WorkspaceTab
}) {
  const [active, setActive] = useState<WorkspaceTab>(initialTab)

  return (
    <div className="space-y-4">
      {/* Top bar with tabs + optional Exit */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <TabBar
            tabs={tabs.map(t => t.value)}
            selected={active}
            onChange={t => setActive(t as WorkspaceTab)}
          />
        </div>
        {onExit && (
          <Button variant="outline" size="sm" onClick={onExit}>
            Exit
          </Button>
        )}
      </div>

      {/* Panels (all mounted, no nested scroll) */}
      <div className="space-y-0">
        {tabs.map(t => {
          const C = t.component
          return (
            <div
              key={t.value}
              hidden={active !== t.value}
              data-tab-panel={t.value}
              className="animate-in fade-in-0"
            >
              {t.value === "Cost" ? (
                <C projectId={projectId ?? ""} />
              ) : (
                <C />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
