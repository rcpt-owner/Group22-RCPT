import React from "react"
import type { RouteDef, RoutePath } from "@/routes/projectRoutes"
import { cn } from "@/utils/cn" 

interface WorkspaceShellProps {
  currentRoute: RouteDef
  onNavigate: (path: RoutePath) => void
  routes: RouteDef[]
  rightPanel?: React.ReactNode
  children?: React.ReactNode  // optionally allow direct composition
}

/*
  WorkspaceShell:
  - Header, Sidebar, (optional) Right panel persist.
  - Only main content area swaps the page component.
  - Future-proof: can inject dynamic block regions in sidebar/rightPanel later.
*/
export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  currentRoute,
  onNavigate,
  routes,
  rightPanel,
  children
}) => {
  const PageComponent = currentRoute.component
  return (
    <div className="h-screen w-screen grid grid-rows-[auto,1fr]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 h-14 border-b bg-background">
        <h1 className="text-lg font-semibold">Research Costing Workspace</h1>
        <div className="text-sm text-muted-foreground">{currentRoute.label}</div>
      </header>

      {/* Body layout */}
      <div className="grid grid-cols-[220px,1fr,280px] h-full overflow-hidden">
        {/* Sidebar */}
        <aside className="border-r overflow-y-auto">
          <nav className="p-3 space-y-1">
            {routes.map(r => (
              <button
                key={r.path}
                onClick={() => onNavigate(r.path)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm font-medium transition",
                  r.path === currentRoute.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                {r.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content (only this swaps) */}
        <main className="overflow-y-auto p-6">
          {children ? children : <PageComponent />}
        </main>

        {/* Optional right panel */}
        <section className="border-l p-4 overflow-y-auto hidden xl:block">
          {rightPanel || (
            <div className="text-sm text-muted-foreground">
              Right panel (metrics / guidance / future blocks)
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
