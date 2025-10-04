import { ProjectFormDemo } from "@/components/demos/ProjectFormDemo"

/*
  ProjectOverviewPage:
  - Previously hosted its own internal tab system; now the workspace tabs handle page switching.
  - Keep this lean: high-level project summary or combined widgets can live here.
  - Forms remain mounted across workspace tab switches (state preserved).
*/
export function ProjectOverviewPage() {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Project Overview</h2>
        <p className="text-sm text-muted-foreground">
          Manage high-level project metadata and foundational details.
        </p>
      </section>

      <section>
        <ProjectFormDemo />
      </section>
    </div>
  )
}
