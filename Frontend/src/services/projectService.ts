// Mock project service loading JSON from /public/api/projects/*

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json()
}

const base = (projectId: string) => `/api/projects/${projectId}`

export interface ProjectOverview {
  projectId: string
  title: string
  summary: string
  budget: number
  status: string
  lastUpdated: string
}

export interface ProjectCostData {
  projectId: string
  staff: Array<{ role: string; fte: number; cost: number }>
  overheadRate: number
  totalDirect: number
  totalIndirect: number
  total: number
}

export interface ProjectPricingData {
  projectId: string
  baseCost: number
  marginRate: number
  suggestedPrice: number
  currency: string
}

export interface ProjectExportSummary {
  projectId: string
  generatedAt: string
  sections: Array<{ id: string; title: string; bytes: number }>
}

// Form payload for the Project Overview DynamicForm
export interface ProjectOverviewFormData {
  title: string
  description?: string
  funder?: string
  department?: string
  startDate: string
  endDate: string
}

export const projectService = {
  getProjectOverview(projectId: string) {
    return getJson<ProjectOverview>(`${base(projectId)}/overview.json`)
  },
  getCostData(projectId: string) {
    return getJson<ProjectCostData>(`${base(projectId)}/cost.json`)
  },
  getPricingData(projectId: string) {
    return getJson<ProjectPricingData>(`${base(projectId)}/pricing.json`)
  },
  getExportSummary(projectId: string) {
    return getJson<ProjectExportSummary>(`${base(projectId)}/export.json`)
  },
  getStaffCosts(projectId: string) {
    return getJson<StaffCost[]>(`${base(projectId)}/staffCosts.json`)
  },
  getNonStaffCosts(projectId: string) {
    return getJson<NonStaffCost[]>(`${base(projectId)}/nonStaffCosts.json`)
  },
  async submitReview(projectId: string) {
    // Mock (TODO: replace with POST)
    return { projectId, submittedAt: new Date().toISOString(), status: "Queued" }
  },
  async updateProjectOverview(projectId: string, payload: ProjectOverviewFormData) {
    // Mock update (TODO: replace with real POST/PUT)
    await new Promise((r) => setTimeout(r, 400))
    return {
      projectId,
      savedAt: new Date().toISOString(),
      status: "OK",
      payload
    }
  }
}
