import {
  projectService,
  type ProjectOverview,
  type ProjectCostData,
  type ProjectOverviewFormData,
} from "@/services/projectService"
import { rcptCache, type RCPTProjectData, type CacheEntry, type RcptCalculatedTotals } from "@/services/rcptCache"

export type {
  ProjectOverview,
  ProjectCostData,
  ProjectOverviewFormData,
} from "@/services/projectService"

export interface StaffCost {
  role: string
  employmentType: string
  category: string
  employmentClassification: string
  fteType: string
  years: Record<string, number>
}

export interface NonStaffCost {
  category: string
  subcategory: string
  description?: string
  inKind: boolean
  years: Record<string, number>
}

export interface RCPTProjectDataLocal extends RCPTProjectData {
  // kept for local clarity; rcptCache.RCPTProjectData is a flexible shape
  overview?: ProjectOverview
  costData?: ProjectCostData
  staffCosts?: StaffCost[]
  nonStaffCosts?: NonStaffCost[]
  lastLoadedAt?: string
  overviewSelectionOptions?: string
  overviewFormData?: ProjectOverviewFormData
}

export interface RcptEngineOptions {
  ttlMs: number
  useSessionCache: boolean
  sessionKeyPrefix: string
}

type CacheEntryLocal = CacheEntry

const CANONICAL_FORM_IDS = new Set([
  "overview",
  "staffCosts",
  "nonStaffCosts",
  "project-overview-form",
])

const defaultOptions: RcptEngineOptions = {
  ttlMs: 10 * 60 * 1000,
  useSessionCache: true,
  sessionKeyPrefix: "rcpt",
}

class RcptEngine {
  private options: RcptEngineOptions = { ...defaultOptions }

  configure(options: Partial<RcptEngineOptions>): void {
    this.options = { ...this.options, ...options }
    rcptCache.configure(options)
  }

  async loadData(projectId: string): Promise<void> {
    if (!projectId) throw new Error("Missing projectId")

    // If a non-expired entry exists, nothing to do.
    const existing = rcptCache.getEntry(projectId)
    if (existing) return

    // Build starting data: prefer session/cache snapshot if present, else fresh
    const starting = rcptCache.ensureEntry(projectId)
    let data: RCPTProjectDataLocal = starting.data as RCPTProjectDataLocal

    // Fetch all service resources in parallel; defensive handling
    const [ovRes, costRes, staffRes, nonStaffRes] = await Promise.allSettled([
      projectService.getProjectOverview(projectId), // TODO: replace with real API GET /api/projects/:projectId/overview
      projectService.getCostData(projectId),       // TODO: replace with real API GET /api/projects/:projectId/cost
      projectService.getStaffCosts(projectId),     // TODO: replace with real API GET /api/projects/:projectId/staffCosts
      projectService.getNonStaffCosts(projectId),  // TODO: replace with real API GET /api/projects/:projectId/nonStaffCosts
    ])

    if (ovRes.status === "fulfilled") {
      const serverOv = ovRes.value
      if (!data.overview) {
        data.overview = serverOv
      }
      // Always prefer local overview to preserve user edits
    }
    if (costRes.status === "fulfilled") data.costData = costRes.value
    if (staffRes.status === "fulfilled") data.staffCosts = staffRes.value
    if (nonStaffRes.status === "fulfilled") data.nonStaffCosts = nonStaffRes.value

    // Merge canonical form data from rcptCache forms into data after loading from server
    const overviewForm = rcptCache.loadForm(projectId, "project-overview-form")
    if (overviewForm) {
      data.overviewFormData = this.mapFormToOverviewForm(overviewForm)
      data.overview = this.mapFormToOverview(overviewForm, data.overview)
    } else {
      const legacyOverviewForm = rcptCache.loadForm(projectId, "overview")
      if (legacyOverviewForm) {
        data.overviewFormData = this.mapFormToOverviewForm(legacyOverviewForm)
        data.overview = this.mapFormToOverview(legacyOverviewForm, data.overview)
      }
    }
    const staffForm = rcptCache.loadForm(projectId, "staffCosts")
    if (staffForm) {
      data.staffCosts = Array.isArray(staffForm) ? staffForm : []
    }
    const nonStaffForm = rcptCache.loadForm(projectId, "nonStaffCosts")
    if (nonStaffForm) {
      data.nonStaffCosts = Array.isArray(nonStaffForm) ? nonStaffForm : []
    }

    data.staffCosts = Array.isArray(data.staffCosts) ? data.staffCosts : []
    data.nonStaffCosts = Array.isArray(data.nonStaffCosts) ? data.nonStaffCosts : []
    data.lastLoadedAt = new Date().toISOString()

    const totals = this.computeTotals(data as RCPTProjectDataLocal)
    const entry: CacheEntryLocal = {
      data,
      totals,
      expiresAt: Date.now() + this.options.ttlMs,
    }

    rcptCache.setEntry(projectId, entry)
  }

  getProjectData(projectId: string): RCPTProjectDataLocal | null {
    const entry = rcptCache.getEntry(projectId)
    return entry ? (entry.data as RCPTProjectDataLocal) : null
  }

  getCalculatedTotals(projectId: string): RcptCalculatedTotals | null {
    const entry = rcptCache.getEntry(projectId)
    return entry ? (entry.totals ?? null) : null
  }

  async refreshCache(projectId?: string): Promise<void> {
    if (projectId) {
      rcptCache.removeEntry(projectId)
      await this.loadData(projectId)
      return
    }
    rcptCache.clearAll()
  }

  saveFormData(projectId: string, formId: string, values: any): void {
    // Persist form draft
    rcptCache.persistForm(projectId, formId, values)

    // Mirror canonical forms into the canonical snapshot
    let mirrored = false
    const entry = rcptCache.ensureEntry(projectId)
    const data = entry.data as RCPTProjectDataLocal

    if (formId === "overview" || formId === "project-overview-form") {
      entry.data.overviewFormData = this.mapFormToOverviewForm(values)
      entry.data.overview = this.mapFormToOverview(values, entry.data.overview)
      mirrored = true
    } else if (formId === "staffCosts") {
      entry.data.staffCosts = Array.isArray(values) ? values : data.staffCosts ?? []
      mirrored = true
    } else if (formId === "nonStaffCosts") {
      entry.data.nonStaffCosts = Array.isArray(values) ? values : data.nonStaffCosts ?? []
      mirrored = true
    }

    if (mirrored) {
      entry.totals = this.computeTotals(entry.data as RCPTProjectDataLocal)
      entry.expiresAt = Date.now() + this.options.ttlMs
      rcptCache.setEntry(projectId, entry)
    }
  }

  loadFormData<T = any>(projectId: string, formId: string): T | null {
    return rcptCache.loadForm(projectId, formId) as T | null
  }

  clearFormData(projectId: string, formId: string): void {
    // Remove persisted form
    rcptCache.removeForm(projectId, formId)
    // Clear from canonical snapshot if needed
    if (CANONICAL_FORM_IDS.has(formId)) {
      const entry = rcptCache.ensureEntry(projectId)
      if (entry) {
        if (formId === "staffCosts") {
          entry.data.staffCosts = []
        } else if (formId === "nonStaffCosts") {
          entry.data.nonStaffCosts = []
        }
        entry.totals = this.computeTotals(entry.data as RCPTProjectDataLocal)
        entry.expiresAt = Date.now() + this.options.ttlMs
        rcptCache.setEntry(projectId, entry)
      }
    }
  }

  async updateProjectOverview(projectId: string, payload: ProjectOverviewFormData): Promise<void> {
    await projectService.updateProjectOverview(projectId, payload) // TODO: wire to PUT/POST backend when available
    const entry = rcptCache.ensureEntry(projectId)
    entry.data.overviewFormData = this.mapFormToOverviewForm(payload, entry.data.overviewFormData)
    entry.data.overview = this.mapFormToOverview(payload, entry.data.overview)

    const { updateProjectTitle } = await import("@/services/userService")
    const title = entry.data.overviewFormData?.title ?? (payload as any)?.title ?? "Unnamed Project"
    try {
      await updateProjectTitle("1", projectId, title) // TODO: replace "1" with real authenticated user id
    } catch {
      // ignore
    }
    try {
      if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
        window.dispatchEvent(new CustomEvent("rcpt:projectTitleUpdated", { detail: { projectId, title } }))
      }
    } catch { /* ignore */ }

    const maybeOptions =
      (payload as any)?.selectionOptions ??
      (payload as any)?.options ??
      (payload as any)?.selections
    if (maybeOptions != null) {
      try {
        entry.data.overviewSelectionOptions =
          typeof maybeOptions === "string" ? maybeOptions : JSON.stringify(maybeOptions)
      } catch {
        entry.data.overviewSelectionOptions = String(maybeOptions)
      }
    }

    entry.expiresAt = Date.now() + this.options.ttlMs
    entry.totals = this.computeTotals(entry.data as RCPTProjectDataLocal)
    rcptCache.setEntry(projectId, entry)
  }

  async submitReview(projectId: string): Promise<void> {
    const res = await projectService.submitReview(projectId)
    const entry = rcptCache.ensureEntry(projectId)
    if (entry.data.overview) {
      entry.data.overview = {
        ...entry.data.overview,
        status: String((res as any)?.status ?? entry.data.overview.status ?? "Queued"),
        lastUpdated: new Date().toISOString(),
      }
    }
    entry.expiresAt = Date.now() + this.options.ttlMs
    entry.totals = this.computeTotals(entry.data as RCPTProjectDataLocal)
    rcptCache.setEntry(projectId, entry)
  }

  setStaffCosts(projectId: string, rows: StaffCost[]): void {
    this.saveFormData(projectId, "staffCosts", rows)
  }

  setNonStaffCosts(projectId: string, rows: NonStaffCost[]): void {
    this.saveFormData(projectId, "nonStaffCosts", rows)
  }

  getStaffCosts(projectId: string): StaffCost[] {
    const data = this.getProjectData(projectId)
    return data?.staffCosts ?? []
  }

  getNonStaffCosts(projectId: string): NonStaffCost[] {
    const data = this.getProjectData(projectId)
    return data?.nonStaffCosts ?? []
  }

  getProjectYears(projectId: string): string[] {
    const data = this.getProjectData(projectId)
    let startYear: number | undefined, endYear: number | undefined
    const overviewForm = data?.overviewFormData
    if (overviewForm) {
      const extractYear = (date: any) => {
        if (!date) return undefined
        if (typeof date === "string") {
          const m = date.match(/(\d{4})/)
          return m && m[1] ? parseInt(m[1], 10) : undefined
        }
        if (typeof date === "object" && date.year) return Number(date.year)
        return undefined
      }
      startYear = extractYear((overviewForm as any).startDate)
      endYear = extractYear((overviewForm as any).endDate)
    }
    if (typeof startYear === "number" && typeof endYear === "number" && endYear >= startYear) {
      const years: string[] = []
      for (let y = startYear; y <= endYear; ++y) years.push(String(y))
      return years
    }
    const now = new Date()
    const base = now.getFullYear()
    const fallbackYears = [String(base), String(base + 1), String(base + 2)]
    return fallbackYears
  }

  getTotalCosts(projectId: string): number {
    const staff = this.getStaffCosts(projectId)
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const s of staff) {
      for (const v of Object.values(s.years ?? {})) total += safeNum(v)
    }
    for (const ns of nonStaff) {
      for (const v of Object.values(ns.years ?? {})) total += safeNum(v)
    }
    return total
  }

  getTotalStaffCosts(projectId: string): number {
    const staff = this.getStaffCosts(projectId)
    let total = 0
    for (const s of staff) {
      for (const v of Object.values(s.years ?? {})) total += safeNum(v)
    }
    return total
  }

  getTotalNonStaffCosts(projectId: string): number {
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const ns of nonStaff) {
      for (const v of Object.values(ns.years ?? {})) total += safeNum(v)
    }
    return total
  }

  getInKindCostTotal(projectId: string): number {
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const ns of nonStaff) {
      if (ns.inKind) {
        for (const v of Object.values(ns.years ?? {})) total += safeNum(v)
      }
    }
    return total
  }

  getTotalPricing(projectId: string): number {
    const totalCosts = this.getTotalCosts(projectId)
    const inKindTotal = this.getInKindCostTotal(projectId)
    return totalCosts - inKindTotal
  }

  getMultiplierCost(projectId: string, multiplier: number): number {
    const totalCosts = this.getTotalCosts(projectId)
    return totalCosts * (multiplier - 1)
  }

  isOverviewComplete(projectId: string): boolean {
    const data = this.getProjectData(projectId)
    return !!(data?.overviewFormData?.title && data.overviewFormData.title.trim())
  }

  subscribe(projectId: string, listener: () => void): () => void {
    return rcptCache.subscribe(projectId, listener)
  }

  // ---- private helpers ----

  private computeTotals(data: RCPTProjectDataLocal): RcptCalculatedTotals {
    // Prefer server totals when available
    if (data.costData && isFiniteNum(data.costData.total) && isFiniteNum(data.costData.totalDirect) && isFiniteNum(data.costData.totalIndirect)) {
      return {
        totalAll: data.costData.total,
        totalDirect: data.costData.totalDirect,
        totalIndirect: data.costData.totalIndirect,
        currency: data.pricingData?.currency,
      }
    }

    const staff = data.staffCosts ?? []
    const nonStaff = data.nonStaffCosts ?? []
    let years: string[] = []
    if (data.overview) {
      const parseYear = (d: any) => {
        if (!d) return undefined
        if (typeof d === "string") {
          const m = d.match(/(\d{4})/)
          return m && m[1] ? parseInt(m[1], 10) : undefined
        }
        if (typeof d === "object" && d.year) return Number(d.year)
        return undefined
      }
      const startYear = parseYear((data.overview as any).startDate)
      const endYear = parseYear((data.overview as any).endDate)
      if (typeof startYear === "number" && typeof endYear === "number" && endYear >= startYear) {
        for (let y = startYear; y <= endYear; ++y) years.push(String(y))
      }
    }
    if (years.length === 0) {
      const now = new Date()
      const base = now.getFullYear()
      years = [String(base), String(base + 1), String(base + 2)]
    }
    const y: number[] = years.map(() => 0)
    for (const row of staff) {
      years.forEach((year, i) => {
        if (row.years && typeof y[i] !== "undefined") y[i] += safeNum(row.years[year])
      })
    }
    for (const row of nonStaff) {
      years.forEach((year, i) => {
        const v = row.inKind ? 0 : (row.years ? safeNum(row.years[year]) : 0)
        if (typeof y[i] !== "undefined") y[i] += v
      })
    }
    const direct = y.reduce((a, b) => a + b, 0)
    let indirect = 0
    const rate = data.costData?.overheadRate
    if (isFiniteNum(rate) && rate! > 0) {
      indirect = direct * (rate as number)
    }
    const total = direct + indirect
    const perYear = years.map((year, i) => {
      const directVal = safeNum(y[i])
      const indirectVal = isFiniteNum(rate) && rate! > 0 ? directVal * (rate as number) : 0
      const totalVal = isFiniteNum(rate) && rate! > 0 ? directVal * (1 + (rate as number)) : directVal
      return {
        yearIndex: i + 1,
        year,
        direct: directVal,
        indirect: indirectVal,
        total: totalVal,
      }
    })
    return {
      totalDirect: direct,
      totalIndirect: indirect,
      totalAll: total,
      perYear,
      currency: data.pricingData?.currency,
    }
  }

  private mapFormToOverviewForm(input: any, existing?: ProjectOverviewFormData): ProjectOverviewFormData {
    return {
      title: input?.title ?? existing?.title ?? "",
      description: input?.description ?? input?.summary ?? existing?.description ?? "",
      funder: input?.funder ?? existing?.funder ?? "",
      department: input?.department ?? existing?.department ?? "",
      startDate: input?.startDate ?? existing?.startDate ?? "",
      endDate: input?.endDate ?? existing?.endDate ?? ""
    }
  }

  private mapFormToOverview(formValues: any, existing?: ProjectOverview): ProjectOverview {
    return {
      ...existing,
      projectId: existing?.projectId ?? "",
      title: formValues.title ?? existing?.title ?? "Unnamed Project",
      summary: formValues.description ?? existing?.summary ?? "",
      budget: existing?.budget ?? 0,
      status: existing?.status ?? "Draft",
      lastUpdated: new Date().toISOString(),
    }
  }
}

function isFiniteNum(v: unknown): v is number {
  return typeof v === "number" && isFinite(v)
}
function safeNum(v: unknown): number {
  const n = Number(v)
  return isFinite(n) ? n : 0
}

export const rcptEngine = new RcptEngine()
