import React, { useEffect, useState } from "react"
import { CircleDollarSign, Users, Package } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { projectService } from "@/services/projectService"

type CostTabProps = {
  projectId: string
}

export default function CostTab({ projectId }: CostTabProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    ;(async () => {
      try {
        // Placeholder: fetch initial data if needed
        setLoading(false)
      } catch (e: any) {
        if (active) setError(e.message || "Failed to load cost data")
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [projectId])

  // Placeholder: State and logic for dynamic JSON forms will be added later.
  // Placeholder: Use projectId when integrating persistence and form data.

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 md:p-6 lg:p-8">
      {/* Top Section: Costs Planning */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-6 w-6 " />
            <CardTitle>Costs Planning</CardTitle>
          </div>
          <CardDescription>
            Define the staff and non-staff costs needed for your research project.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sub-Tabs: Staff / Non-Staff */}
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="nonstaff" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Non-Staff
          </TabsTrigger>
        </TabsList>

        {/* Main Section (Staff Costs) */}
        <TabsContent value="staff" className="space-y-4 pt-4">

          <Card className="border rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-lg font-medium">Staff Costs:</h3>
              <Button
                type="button"
                className="bg-[#3B2B26] hover:bg-[#2f231f] text-white"
              >
                + Add Staff Member
              </Button>
            </CardHeader>

            <CardContent className="min-h-[220px] flex items-center justify-center text-center">
              <div className="flex flex-col items-center justify-center gap-3">
                <Users className="h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No Staff Added Yet.</p>
              </div>
            </CardContent>
          </Card>
          
        </TabsContent>

        {/* Non-Staff placeholder (no functionality yet) */}
        <TabsContent value="nonstaff" className="space-y-4 pt-4">
          <Card className="border rounded-lg">
            <CardContent className="py-10 text-center text-muted-foreground">
              <Package className="mx-auto mb-3 h-8 w-8" />
              Non-Staff costs UI coming soon.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom-right Continue button */}
      <div className="flex justify-end">
        <Button
          type="button"
          className="bg-[#3B2B26] hover:bg-[#2f231f] text-white"
        >
          Continue to Pricing and Summary →
        </Button>
      </div>

      {/* Placeholder: Replace above placeholders with DynamicForm-driven UI later. */}
    </div>
  )
}