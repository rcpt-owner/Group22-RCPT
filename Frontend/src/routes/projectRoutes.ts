import { StaffCostsPage } from "@/pages/StaffCostsPage"
import { ProjectFormDemo } from "@/components/demos/ProjectFormDemo"
import { ProjectOverviewPage } from "@/pages/ProjectOverviewPage"
import { DemoShowcasePage } from "@/pages/DemoShowcasePage"

export interface RouteDef {
  path: RoutePath
  label: string
  component: React.ComponentType
}

export const projectRoutes = [
  { path: "overview", label: "Overview", component: ProjectOverviewPage },
  { path: "staff-costs", label: "Staff Costs", component: StaffCostsPage },
  { path: "project-form", label: "Project Form", component: ProjectFormDemo },
  { path: "demos", label: "UI Demos", component: DemoShowcasePage },
] as const

export type RoutePath = typeof projectRoutes[number]["path"]

export function isRoutePath(v: string): v is RoutePath {
  return projectRoutes.some(r => r.path === v)
}

export function getRoute(path: RoutePath): RouteDef {
  // Non-null because validated by isRoutePath
  return projectRoutes.find(r => r.path === path)!
}
