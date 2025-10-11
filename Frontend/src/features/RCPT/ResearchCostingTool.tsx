import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DemoShowcasePage } from "../DemoSections/DemoShowcasePage"
import { ProjectOverviewTab } from "./tabs/ProjectOverviewTab"
import CostTab from "./tabs/CostTab/CostTab"


export function ResearchCostingTool({
  onExit,
  projectId,
  userId,
  initialTab = "Demo Showcase",
}: {
  onExit?: () => void
  projectId?: string
  userId?: string
  initialTab?: string
}) {
  return (
    <div className="space-y-4">
      <Tabs defaultValue={initialTab} className="w-full">
        {/* Header with tabs + Exit button */}
        <div className="flex items-center justify-between gap-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="Demo Showcase" className="text-sm">Demo Showcase</TabsTrigger>
            <TabsTrigger value="Project Overview" className="text-sm">Project Overview</TabsTrigger>
            <TabsTrigger value="Cost" className="text-sm">Cost</TabsTrigger>
            <TabsTrigger value="Pricing" className="text-sm">Pricing</TabsTrigger>
            <TabsTrigger value="Export" className="text-sm">Export</TabsTrigger>
          </TabsList>
          {onExit && (
            <Button variant="outline" size="sm" onClick={onExit}>
              Exit
            </Button>
          )}
        </div>

        {/* Panels */}
        <div className="space-y-0 mt-4">
          <TabsContent value="Demo Showcase" className="animate-in fade-in-0">
            <DemoShowcasePage />
          </TabsContent>
          <TabsContent value="Project Overview" className="animate-in fade-in-0">
            <ProjectOverviewTab />
          </TabsContent>
          <TabsContent value="Cost" className="animate-in fade-in-0">
            <CostTab projectId={projectId ?? ""} />
          </TabsContent>
          <TabsContent value="Pricing" className="animate-in fade-in-0">
            <div>Pricing Tab Content (placeholder)</div>
          </TabsContent>
          <TabsContent value="Export" className="animate-in fade-in-0">
            <div>Export Tab Content (placeholder)</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
