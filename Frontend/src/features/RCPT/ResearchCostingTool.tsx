import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProjectOverviewTab } from "./tabs/ProjectOverviewTab"
import CostTab from "./tabs/CostTab"
import ExportTab from "./tabs/ExportTab"
import PricingTab from "./tabs/PricingTab"


export function ResearchCostingTool({
  onExit,
  projectId,
  userId,
  initialTab = "Project Overview",
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
          {/* Use auto-fit so tabs auto-adjust when one is removed; wraps on small screens */}
          <TabsList className="grid w-full grid-cols-[repeat(auto-fit,minmax(8rem,1fr))] gap-2">
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
          <TabsContent value="Project Overview" className="animate-in fade-in-0">
            <ProjectOverviewTab />
          </TabsContent>
          <TabsContent value="Cost" className="animate-in fade-in-0">
            <CostTab projectId={projectId ?? ""} />
          </TabsContent>
          <TabsContent value="Pricing" className="animate-in fade-in-0">
            <PricingTab projectId={projectId ?? ""} />
          </TabsContent>
          <TabsContent value="Export" className="animate-in fade-in-0">
            <ExportTab
              totalCost={0}      // replace with actual total cost
              staffCount={0}     // replace with actual staff count
              nonStaffCount={0}  // replace with actual non-staff items count
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}
