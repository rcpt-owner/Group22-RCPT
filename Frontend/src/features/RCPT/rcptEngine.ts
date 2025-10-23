import {
  projectService,
  type ProjectOverview,
  type ProjectCostData,
  type ProjectPricingData,
  type ProjectExportSummary,
  type ProjectOverviewFormData,
} from "@/services/projectService"

export type {
  ProjectOverview,
  ProjectCostData,
  ProjectPricingData,
  ProjectExportSummary,
  ProjectOverviewFormData,
} from "@/services/projectService"

export interface StaffCost {
  role: string
  employmentType: string
  category: string
  employmentClassification: string
  fteType: string
  years: Record<string, number> // e.g. { "2023": 1000, "2024": 2000 } this number can be changed from money to time later if needed
}

export interface NonStaffCost {
  category: string
  subcategory: string
  description?: string
  inKind: boolean
  years: Record<string, number>
}

export interface RCPTProjectData {
  projectId: string
  overview?: ProjectOverview
  costData?: ProjectCostData
  pricingData?: ProjectPricingData
  exportSummary?: ProjectExportSummary
  staffCosts?: StaffCost[]
  nonStaffCosts?: NonStaffCost[]
  lastLoadedAt?: string
  // Cached selection options for the Project Overview tab (serialized)
  overviewSelectionOptions?: string
  overviewFormData?: ProjectOverviewFormData
}

export interface RcptCalculatedTotals {
  totalDirect: number
  totalIndirect: number
  totalAll: number
  perYear?: Array<{ yearIndex: number; year?: string; direct: number; indirect: number; total: number }>
  currency?: string
}

export interface RcptEngineOptions {
  ttlMs: number
  useSessionCache: boolean
  sessionKeyPrefix: string
}

type CacheEntry = {
  data: RCPTProjectData
  totals?: RcptCalculatedTotals
  expiresAt: number
}

// Canonical formIds that mirror directly into RCPTProjectData for totals/subscriptions
const CANONICAL_FORM_IDS = new Set(["overview", "staffCosts", "nonStaffCosts", "project-overview-form"])

const defaultOptions: RcptEngineOptions = {
  ttlMs: 10 * 60 * 1000, // 10 minutes
  useSessionCache: true,
  sessionKeyPrefix: "rcpt",
}

class RcptEngine {
  private options: RcptEngineOptions = { ...defaultOptions }
  private cache = new Map<string, CacheEntry>()
  private listeners = new Map<string, Set<() => void>>()

  configure(options: Partial<RcptEngineOptions>): void {
    this.options = { ...this.options, ...options }
  }

  async loadData(projectId: string): Promise<void> {
    if (!projectId) throw new Error("Missing projectId")

    // Serve from cache if not expired
    const existing = this.cache.get(projectId)
    if (existing && !this.isExpired(existing)) return

    // Try session cache as starting point
    let data: RCPTProjectData | undefined
    const sessionEntry = this.readSession(projectId)
    if (sessionEntry && !this.isExpired(sessionEntry)) {
      data = sessionEntry.data
    } else if (existing) {
      data = existing.data
    } else {
      data = { projectId }
    }

    // Fetch all service resources in parallel; defensive handling
    const [ovRes, costRes, priceRes, exportRes, staffRes, nonStaffRes] = await Promise.allSettled([
      projectService.getProjectOverview(projectId),
      projectService.getCostData(projectId),
      projectService.getPricingData(projectId),
      projectService.getExportSummary(projectId),
      projectService.getStaffCosts(projectId),
      projectService.getNonStaffCosts(projectId),
    ])

    // Merge successes into data; keep local staff/non-staff rows if present
    if (ovRes.status === "fulfilled") {
      const serverOv = ovRes.value
      if (!data.overview) {
        data.overview = serverOv
      }
      // Always prefer local overview to preserve user edits
    }
    if (costRes.status === "fulfilled") data.costData = costRes.value
    if (priceRes.status === "fulfilled") data.pricingData = priceRes.value
    if (exportRes.status === "fulfilled") data.exportSummary = exportRes.value
    if (staffRes.status === "fulfilled") data.staffCosts = staffRes.value
    if (nonStaffRes.status === "fulfilled") data.nonStaffCosts = nonStaffRes.value

    // Optional: Add fallback or programmatic population here if JSON is missing
    // Example: if (!data.staffCosts?.length) data.staffCosts = [/* default rows */]

    // Merge canonical form data into data after loading from server
    const overviewForm = this.loadFormData(projectId, "project-overview-form")
    if (overviewForm) {
      data.overviewFormData = this.mapFormToOverviewForm(overviewForm)
      data.overview = this.mapFormToOverview(overviewForm, data.overview)
    } else {
      // fallback: try "overview" formId for legacy support
      const legacyOverviewForm = this.loadFormData(projectId, "overview")
      if (legacyOverviewForm) {
        data.overviewFormData = this.mapFormToOverviewForm(legacyOverviewForm)
        data.overview = this.mapFormToOverview(legacyOverviewForm, data.overview)
      }
    }
    const staffForm = this.loadFormData(projectId, "staffCosts")
    if (staffForm) {
      data.staffCosts = Array.isArray(staffForm) ? staffForm : []
    }
    const nonStaffForm = this.loadFormData(projectId, "nonStaffCosts")
    if (nonStaffForm) {
      data.nonStaffCosts = Array.isArray(nonStaffForm) ? nonStaffForm : []
    }

    // Ensure arrays are defined (fallback to empty if not from form/server)
    data.staffCosts = Array.isArray(data.staffCosts) ? data.staffCosts : []
    data.nonStaffCosts = Array.isArray(data.nonStaffCosts) ? data.nonStaffCosts : []
    data.lastLoadedAt = new Date().toISOString()

    const totals = this.computeTotals(data)
    const entry: CacheEntry = {
      data,
      totals,
      expiresAt: Date.now() + this.options.ttlMs,
    }

    this.cache.set(projectId, entry)
    this.writeSession(entry)
    this.notify(projectId)
  }

  getProjectData(projectId: string): RCPTProjectData | null {
    const entry = this.cache.get(projectId);
    if (!entry || this.isExpired(entry) || entry.data.projectId !== projectId) {
      // Invalidate if projectId mismatch
      if (entry) this.cache.delete(projectId);
      return null;
    }
    return entry.data;
  }

  getCalculatedTotals(projectId: string): RcptCalculatedTotals | null {
    const entry = this.cache.get(projectId)
    if (!entry || this.isExpired(entry)) return null
    return entry.totals ?? null
  }

  async refreshCache(projectId?: string): Promise<void> {
    if (projectId) {
      this.cache.delete(projectId)
      this.removeSession(projectId)
      await this.loadData(projectId)
      return
    }
    // Clear all
    const ids = Array.from(this.cache.keys())
    this.cache.clear()
    if (this.hasSession()) {
      // Best effort: remove all keys with prefix
      try {
        const prefix = `${this.options.sessionKeyPrefix}:project:`
        for (let i = 0; i < (window.sessionStorage?.length ?? 0); i++) {
          const key = window.sessionStorage.key(i)
          if (key && key.startsWith(prefix)) window.sessionStorage.removeItem(key)
        }
      } catch { /* ignore */ }
    }
  }

  saveFormData(projectId: string, formId: string, values: any): void {
    const entry = this.ensureEntry(projectId)
    // Store in sessionStorage
    this.persistFormToSession(projectId, formId, values)
    // Mirror to cache if canonical
    if (CANONICAL_FORM_IDS.has(formId)) {
      if (formId === "overview" || formId === "project-overview-form") {
        entry.data.overviewFormData = this.mapFormToOverviewForm(values)
        entry.data.overview = this.mapFormToOverview(values, entry.data.overview)
      } else if (formId === "add-staff-cost-form") {
        entry.data.staffCosts = Array.isArray(values) ? values : []
      } else if (formId === "add-nonstaff-cost-form") {
        entry.data.nonStaffCosts = Array.isArray(values) ? values : []
      }
      entry.totals = this.computeTotals(entry.data)
      this.cache.set(projectId, entry)
      this.writeSession(entry)
      this.notify(projectId)
    }
  }

  loadFormData<T = any>(projectId: string, formId: string): T | null {
    if (!this.hasSession()) return null
    try {
      const raw = window.sessionStorage.getItem(this.getFormKey(projectId, formId))
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  }

  clearFormData(projectId: string, formId: string): void {
    // Remove from sessionStorage
    this.removeFormFromSession(projectId, formId)
    // Clear from cache if canonical
    if (CANONICAL_FORM_IDS.has(formId)) {
      const entry = this.cache.get(projectId)
      if (entry) {
        if (formId === "staffCosts") {
          entry.data.staffCosts = []
        } else if (formId === "nonStaffCosts") {
          entry.data.nonStaffCosts = []
        }
        // Note: Do not clear overview here to preserve saved data
        entry.totals = this.computeTotals(entry.data)
        this.cache.set(projectId, entry)
        this.writeSession(entry)
        this.notify(projectId)
      }
    }
  }

  async updateProjectOverview(projectId: string, payload: ProjectOverviewFormData): Promise<void> {
    await projectService.updateProjectOverview(projectId, payload)
    const entry = this.ensureEntry(projectId)
    // Always update overviewFormData as canonical
    entry.data.overviewFormData = this.mapFormToOverviewForm(payload, entry.data.overviewFormData)
    // Optionally update overview for legacy/compat
    entry.data.overview = this.mapFormToOverview(payload, entry.data.overview)

    // Sync title to project metadata
    const { updateProjectTitle } = await import("@/services/userService")
    const title = entry.data.overviewFormData?.title ?? (payload as any)?.title ?? "Unnamed Project"
    updateProjectTitle("1", projectId, title) // Assuming userId is "1"

    // Cache any selection options as a string to ensure reliable session serialization
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
    this.cache.set(projectId, entry)
    this.writeSession(entry)
    this.notify(projectId)
    this.notify(projectId)
  }

  async submitReview(projectId: string): Promise<void> {
    const res = await projectService.submitReview(projectId)
    const entry = this.ensureEntry(projectId)
    if (entry.data.overview) {
      entry.data.overview = {
        ...entry.data.overview,
        status: String((res as any)?.status ?? entry.data.overview.status ?? "Queued"),
        lastUpdated: new Date().toISOString(),
      }
    }
    entry.expiresAt = Date.now() + this.options.ttlMs
    this.cache.set(projectId, entry)
    this.writeSession(entry)
    this.notify(projectId)
  }

  setStaffCosts(projectId: string, rows: StaffCost[]): void {
    this.saveFormData(projectId, "add-staff-cost-form", rows)
  }

  setNonStaffCosts(projectId: string, rows: NonStaffCost[]): void {
    this.saveFormData(projectId, "add-staff-cost-form", rows)
  }

  getStaffCosts(projectId: string): StaffCost[] {
    const data = this.getProjectData(projectId)
    return data?.staffCosts ?? []
  }

  getNonStaffCosts(projectId: string): NonStaffCost[] {
    const data = this.getProjectData(projectId)
    return data?.nonStaffCosts ?? []
  }

  
  // BUGGED
  getProjectYears(projectId: string): string[] {
    const data = this.getProjectData(projectId)
    let startYear: number | undefined, endYear: number | undefined
    const overviewForm = data?.overviewFormData
    if (overviewForm) {
      const extractYear = (date: any) => {
        if (!date) return undefined
        if (typeof date === "string") {
          const m = date.match(/(\d{4})/)
          return m ? parseInt(m[1], 10) : undefined
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
    if (!this.listeners.has(projectId)) this.listeners.set(projectId, new Set())
    const set = this.listeners.get(projectId)!
    set.add(listener)
    return () => {
      set.delete(listener)
      if (set.size === 0) this.listeners.delete(projectId)
    }
  }

  // ---- private helpers ----

  private ensureEntry(projectId: string): CacheEntry {
    const existing = this.cache.get(projectId)
    if (existing && !this.isExpired(existing)) return existing
    const session = this.readSession(projectId)
    if (session && !this.isExpired(session)) {
      this.cache.set(projectId, session)
      return session
    }
    const fresh: CacheEntry = {
      data: { projectId, userId: "", staffCosts: [], nonStaffCosts: [] },
      totals: this.computeTotals({ projectId, staffCosts: [], nonStaffCosts: [] }),
      expiresAt: Date.now() + this.options.ttlMs,
    }
    this.cache.set(projectId, fresh)
    return fresh
  }

  private computeTotals(data: RCPTProjectData): RcptCalculatedTotals {
    // Prefer server totals when available
    if (data.costData && isFiniteNum(data.costData.total) && isFiniteNum(data.costData.totalDirect) && isFiniteNum(data.costData.totalIndirect)) {
      return {
        totalAll: data.costData.total,
        totalDirect: data.costData.totalDirect,
        totalIndirect: data.costData.totalIndirect,
        // perYear unknown from server; omit
        currency: data.pricingData?.currency,
      }
    }

    const staff = data.staffCosts ?? []
    const nonStaff = data.nonStaffCosts ?? []
    // Get dynamic years
    let years: string[] = []
    if (data.overview) {
      const parseYear = (d: any) => {
        if (!d) return undefined
        if (typeof d === "string") {
          const m = d.match(/(\d{4})/)
          return m ? parseInt(m[1], 10) : undefined
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
      years.forEach((year, i) => { y[i] += safeNum(row.years?.[year]) })
    }
    for (const row of nonStaff) {
      years.forEach((year, i) => {
        const v = row.inKind ? 0 : safeNum(row.years?.[year])
        y[i] += v
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

  private isExpired(entry: CacheEntry): boolean {
    return Date.now() > entry.expiresAt
  }

  private notify(projectId: string) {
    const set = this.listeners.get(projectId)
    if (!set) return
    for (const fn of Array.from(set)) {
      try { fn() } catch { /* ignore */ }
    }
  }

  private getSessionKey(projectId: string): string {
    return `${this.options.sessionKeyPrefix}:project:${projectId}`
  }

  private hasSession(): boolean {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
  }

  private readSession(projectId: string): CacheEntry | null {
    if (!this.options.useSessionCache || !this.hasSession()) return null
    try {
      const raw = window.sessionStorage.getItem(this.getSessionKey(projectId))
      if (!raw) return null
      const parsed = JSON.parse(raw)
      // Basic shape guard
      if (!parsed || typeof parsed !== "object" || !parsed.data) return null
      // Coerce
      const entry: CacheEntry = {
        data: parsed.data,
        totals: parsed.totals,
        expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : Date.now(), // if missing, expire now
      }
      return entry
    } catch {
      return null
    }
  }

  private writeSession(entry: CacheEntry) {
    if (!this.options.useSessionCache || !this.hasSession()) return
    try {
      window.sessionStorage.setItem(this.getSessionKey(entry.data.projectId), JSON.stringify(entry))
    } catch {
      // ignore quota or serialization errors
    }
  }

  private removeSession(projectId: string) {
    if (!this.options.useSessionCache || !this.hasSession()) return
    try {
      window.sessionStorage.removeItem(this.getSessionKey(projectId))
      // Also remove any legacy per-field rows we may write below
      window.sessionStorage.removeItem(this.getSessionKey(projectId) + ":staffCosts")
      window.sessionStorage.removeItem(this.getSessionKey(projectId) + ":nonStaffCosts")
    } catch { /* ignore */ }
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



  private getFormKey(projectId: string, formId: string): string {
    return `${this.options.sessionKeyPrefix}:project:${projectId}:form:${formId}`
  }

  private persistFormToSession(projectId: string, formId: string, values: any): void {
    if (!this.hasSession()) return
    try {
      window.sessionStorage.setItem(this.getFormKey(projectId, formId), JSON.stringify(values))
    } catch { /* ignore */ }
  }

  private removeFormFromSession(projectId: string, formId: string): void {
    if (!this.hasSession()) return
    try {
      window.sessionStorage.removeItem(this.getFormKey(projectId, formId))
    } catch { /* ignore */ }
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
