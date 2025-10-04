import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

interface DashboardPageProps {
  onEnterWorkspace: () => void
  onLogout: () => void
}

export function DashboardPage({ onEnterWorkspace, onLogout }: DashboardPageProps) {
  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Button variant="outline" onClick={onLogout}>Logout</Button>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Research Costing Workspace</CardTitle>
          </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Enter the costing environment to manage project data & cost inputs.
              {/* FUTURE:
                  - Prefetch workspace initial route data on hover/focus for instant transition.
                  - Show recent projects or last edited form snapshot here.
              */}
            </CardContent>
            <CardFooter>
              <Button onClick={onEnterWorkspace}>Open Workspace</Button>
            </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder for some information.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
