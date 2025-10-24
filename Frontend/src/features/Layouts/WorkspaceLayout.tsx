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
    deleteUserProject("1", projectId) // Assuming userId is "1" as per existing code
    rcptEngine.refreshCache(projectId) // Clear cache for the project
    navigate("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background">
        {/* Added centered container with responsive side padding */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">
            {projectId ? `Workspace` : "Workspace"}
          </h1>
          <div className="flex items-center gap-2">
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

      <main className="flex-1">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <ResearchCostingTool
            projectId={projectId ?? ""}
            // onExit could navigate back if desired:
            // onExit={() => navigate("/dashboard")}
            // Not too necassary since there is a button in the header
          />
        </div>
      </main>
    </div>
  )
}