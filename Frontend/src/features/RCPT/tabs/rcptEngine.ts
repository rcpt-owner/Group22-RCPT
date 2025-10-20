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
  year1: number
  year2: number
  year3: number
}

export interface NonStaffCost {
  category: string
  subcategory: string
  description?: string
  inKind: boolean
  year1: number
  year2: number
  year3: number
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
}

export interface RcptCalculatedTotals {
  totalDirect: number
  totalIndirect: number
  totalAll: number
  perYear?: Array<{ yearIndex: number; direct: number; indirect: number; total: number }>
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
const CANONICAL_FORM_IDS = new Set(["overview", "staffCosts", "nonStaffCosts"])

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
      } else {
        // Prefer the newer one by lastUpdated
        const localTs = Date.parse(data.overview.lastUpdated ?? "")
        const serverTs = Date.parse(serverOv.lastUpdated ?? "")
        if (isFinite(localTs) && isFinite(serverTs)) {
          data.overview = localTs >= serverTs ? data.overview : serverOv
        } else {
          // If timestamps are missing, keep local to avoid clobbering user edits
          data.overview = data.overview
        }
      }
    }
    if (costRes.status === "fulfilled") data.costData = costRes.value
    if (priceRes.status === "fulfilled") data.pricingData = priceRes.value
    if (exportRes.status === "fulfilled") data.exportSummary = exportRes.value
    if (staffRes.status === "fulfilled") data.staffCosts = staffRes.value
    if (nonStaffRes.status === "fulfilled") data.nonStaffCosts = nonStaffRes.value

    // Optional: Add fallback or programmatic population here if JSON is missing
    // Example: if (!data.staffCosts?.length) data.staffCosts = [/* default rows */]

    // Merge canonical form data into data after loading from server
    const overviewForm = this.loadFormData(projectId, "overview")
    if (overviewForm) {
      data.overview = this.mapFormToOverview(overviewForm, data.overview)
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
    const entry = this.cache.get(projectId)
    if (!entry || this.isExpired(entry)) return null
    return entry.data
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
      if (formId === "overview") {
        entry.data.overview = this.mapFormToOverview(values, entry.data.overview)
      } else if (formId === "staffCosts") {
        entry.data.staffCosts = Array.isArray(values) ? values : []
      } else if (formId === "nonStaffCosts") {
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
        if (formId === "overview") {
          entry.data.overview = undefined
        }
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
    const existing = entry.data.overview ?? {
      projectId,
      title: "",
      summary: "",
      budget: 0,
      status: "Draft",
      lastUpdated: new Date().toISOString(),
    }
    // Merge fields (form uses "description" which maps to "summary")
    const merged: ProjectOverview = {
      ...existing,
      title: payload.title ?? existing.title,
      summary: payload.description ?? existing.summary,
      lastUpdated: new Date().toISOString(),
    }
    entry.data.overview = merged

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

  getTotalCosts(projectId: string): number {
    const staff = this.getStaffCosts(projectId)
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const s of staff) {
      total += safeNum(s.year1) + safeNum(s.year2) + safeNum(s.year3)
    }
    for (const ns of nonStaff) {
      if (!ns.inKind) {
        total += safeNum(ns.year1) + safeNum(ns.year2) + safeNum(ns.year3)
      }
    }
    return total
  }

  getTotalStaffCosts(projectId: string): number {
    const staff = this.getStaffCosts(projectId)
    let total = 0
    for (const s of staff) {
      total += safeNum(s.year1) + safeNum(s.year2) + safeNum(s.year3)
    }
    return total
  }

  getTotalNonStaffCosts(projectId: string): number {
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const ns of nonStaff) {      
      total += safeNum(ns.year1) + safeNum(ns.year2) + safeNum(ns.year3)
    }
    return total
  }

  getInKindCostTotal(projectId: string): number {
    const nonStaff = this.getNonStaffCosts(projectId)
    let total = 0
    for (const ns of nonStaff) {
      if (ns.inKind) {
        total += safeNum(ns.year1) + safeNum(ns.year2) + safeNum(ns.year3)
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
      data: { projectId, staffCosts: [], nonStaffCosts: [] },
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
    const y = [0, 0, 0] as [number, number, number]

    for (const row of staff) {
      y[0] += safeNum(row.year1)
      y[1] += safeNum(row.year2)
      y[2] += safeNum(row.year3)
    }
    for (const row of nonStaff) {
      // If inKind is true, treat it as zero cost for totals
      const k1 = row.inKind ? 0 : safeNum(row.year1)
      const k2 = row.inKind ? 0 : safeNum(row.year2)
      const k3 = row.inKind ? 0 : safeNum(row.year3)
      y[0] += k1
      y[1] += k2
      y[2] += k3
    }

    const direct = y[0] + y[1] + y[2]
    let indirect = 0
    const rate = data.costData?.overheadRate
    if (isFiniteNum(rate) && rate! > 0) {
      indirect = direct * (rate as number)
    }
    const total = direct + indirect

    const perYear = y.map((dy, i) => ({
      yearIndex: i + 1,
      direct: dy,
      indirect: isFiniteNum(rate) && rate! > 0 ? dy * (rate as number) : 0,
      total: isFiniteNum(rate) && rate! > 0 ? dy * (1 + (rate as number)) : dy,
    }))

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

  private mapFormToOverview(formValues: any, existing?: ProjectOverview): ProjectOverview {
    return {
      ...existing,
      projectId: existing?.projectId ?? "",
      title: formValues.title ?? existing?.title ?? "",
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
