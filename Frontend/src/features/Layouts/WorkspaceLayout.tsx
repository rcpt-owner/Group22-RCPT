import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ResearchCostingTool } from "@/features/RCPT/ResearchCostingTool"

export function WorkspaceLayout() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        {/* Added centered container with responsive side padding */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {projectId ? `${projectId} Workspace` : "Workspace"}
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Main content now centered with same max width + side padding */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <ResearchCostingTool
            projectId={projectId}
            userId={"1"}
            // onExit could navigate back if desired:
            // onExit={() => navigate("/dashboard")}
            // Not too necassary since there is a button in the header
          />
        </div>
      </main>
    </div>
  )
}