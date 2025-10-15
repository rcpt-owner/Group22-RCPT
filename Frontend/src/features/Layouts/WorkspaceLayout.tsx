import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ResearchCostingTool } from "@/features/RCPT/ResearchCostingTool"
import { Home, Bell, Settings } from "lucide-react"

export function WorkspaceLayout() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b shadow-sm">
        <div className="flex items-center gap-4">
          {/* 🔸 Logo made larger */}
          <img
            src="/resources/University-of-Melbourne-logo-1.png"
            alt="Unimelb Logo"
            className="h-16 w-auto" // was h-10
          />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center tracking-wide uppercase">
          Research Costing and Pricing Tool
        </h1>

        <div className="flex items-center gap-4">
          {/* Home page (dashboard)*/}
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <Home className="h-5 w-5" />
          </Button>

          { /* Other buttons are ghost style and also functionality will come later. */}
          <Button variant="ghost" size="icon"><Bell className="h-5 w-5" /></Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/adminSettings")}
            title="Admin Settings"
          >
            <Settings className="h-5 w-5" />
          </Button>
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