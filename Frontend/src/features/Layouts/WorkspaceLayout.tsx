import { useNavigate, useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ResearchCostingTool } from "@/features/RCPT/ResearchCostingTool"
import { rcptEngine } from "@/features/RCPT/rcptEngine"
import { deleteUserProject } from "@/services/userService"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function WorkspaceLayout() {
  const navigate = useNavigate()
  const { projectId } = useParams<{ projectId: string }>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const handleDeleteProject = () => {
    if (!projectId) return
    deleteUserProject("1", projectId) // replace "1" with dynamic userId if needed
    rcptEngine.refreshCache(projectId)
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Top Navigation Bar */}
      <header className="w-full flex items-center justify-between px-10 py-5 border-b shadow-sm bg-background">
        <div className="flex items-center gap-4">
          <img
            src="/resources/University-of-Melbourne-logo-1.png"
            alt="Unimelb Logo"
            className="h-16 w-auto"
          />
        </div>

        <h1 className="text-xl md:text-2xl font-semibold text-center tracking-wide uppercase">
          Research Costing and Pricing Tool
        </h1>

        <div className="flex items-center gap-2">
          {/* Delete Project Button */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Project
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Project</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this project? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Dashboard Button */}
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <ResearchCostingTool projectId={projectId ?? ""} userId={"1"} />
        </div>
      </main>
    </div>
  )
}
