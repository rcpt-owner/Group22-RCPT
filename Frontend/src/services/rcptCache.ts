export type RcptCalculatedTotals = {
  totalDirect: number
  totalIndirect: number
  totalAll: number
  perYear?: Array<{ yearIndex: number; year?: string; direct: number; indirect: number; total: number }>
  currency?: string | null
}

export type RCPTProjectData = {
  projectId: string
  // allow flexible shape for nested pieces (overview, costData, etc.)
  [k: string]: any
}

export type CacheEntry = {
  data: RCPTProjectData
  totals?: RcptCalculatedTotals
  expiresAt: number
}

export interface CacheOptions {
  ttlMs: number
  useSessionCache: boolean
  sessionKeyPrefix: string
}

const defaultOptions: CacheOptions = {
  ttlMs: 10 * 60 * 1000, // 10 minutes
  useSessionCache: true,
  sessionKeyPrefix: "rcpt",
}

class RcptCacheImpl {
  private options: CacheOptions = { ...defaultOptions }
  private map = new Map<string, CacheEntry>()
  private listeners = new Map<string, Set<() => void>>()

  configure(opts: Partial<CacheOptions>): void {
    this.options = { ...this.options, ...opts }
  }

  private getEntryKey(projectId: string) {
    return `${this.options.sessionKeyPrefix}:project:${projectId}`
  }
  private getFormKey(projectId: string, formId: string) {
    return `${this.options.sessionKeyPrefix}:project:${projectId}:form:${formId}`
  }

  private hasSession(): boolean {
    return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined"
  }

  private safeParse(raw: string | null): any | null {
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  private isExpired(entry: CacheEntry | null | undefined) {
    return !entry || Date.now() > (entry.expiresAt ?? 0)
  }

  // Returns non-expired entry or null
  getEntry(projectId: string): CacheEntry | null {
    const existing = this.map.get(projectId)
    if (existing && !this.isExpired(existing)) return existing

    // Try session if enabled
    if (this.options.useSessionCache && this.hasSession()) {
      try {
        const raw = window.sessionStorage.getItem(this.getEntryKey(projectId))
        const parsed = this.safeParse(raw)
        if (parsed && typeof parsed === "object" && parsed.data) {
          const entry: CacheEntry = {
            data: parsed.data,
            totals: parsed.totals,
            expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : 0,
          }
          if (!this.isExpired(entry)) {
            // promote into memory
            this.map.set(projectId, entry)
            return entry
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return null
  }

  // Ensure an entry exists for projectId. Attempts in-memory (even expired as fallback), then session, else create fresh.
  ensureEntry(projectId: string): CacheEntry {
    const existing = this.map.get(projectId)
    if (existing && !this.isExpired(existing)) return existing

    // try session
    if (this.options.useSessionCache && this.hasSession()) {
      try {
        const raw = window.sessionStorage.getItem(this.getEntryKey(projectId))
        const parsed = this.safeParse(raw)
        if (parsed && typeof parsed === "object" && parsed.data) {
          const sessionEntry: CacheEntry = {
            data: parsed.data,
            totals: parsed.totals,
            expiresAt: typeof parsed.expiresAt === "number" ? parsed.expiresAt : Date.now(),
          }
          if (!this.isExpired(sessionEntry)) {
            this.map.set(projectId, sessionEntry)
            return sessionEntry
          }
        }
      } catch {
        // ignore
      }
    }

    // If there was an existing in-memory entry (even expired), use it as fallback (preserve previous behaviour)
    if (existing) {
      // refresh expiration when promoting
      const fallback: CacheEntry = {
        data: existing.data,
        totals: existing.totals,
        expiresAt: Date.now() + this.options.ttlMs,
      }
      this.map.set(projectId, fallback)
      return fallback
    }

    // create fresh
    const fresh: CacheEntry = {
      data: { projectId, staffCosts: [], nonStaffCosts: [] },
      totals: undefined,
      expiresAt: Date.now() + this.options.ttlMs,
    }
    this.map.set(projectId, fresh)
    return fresh
  }

  setEntry(projectId: string, entry: CacheEntry): void {
    const toStore: CacheEntry = { ...entry }
    // ensure expiresAt is present
    if (typeof toStore.expiresAt !== "number") {
      toStore.expiresAt = Date.now() + this.options.ttlMs
    }
    this.map.set(projectId, toStore)
    if (this.options.useSessionCache && this.hasSession()) {
      try {
        window.sessionStorage.setItem(this.getEntryKey(projectId), JSON.stringify(toStore))
      } catch {
        // ignore quota/serialization errors
      }
    }
    this.notify(projectId)
  }

  removeEntry(projectId: string): void {
    this.map.delete(projectId)
    if (this.options.useSessionCache && this.hasSession()) {
      try {
        window.sessionStorage.removeItem(this.getEntryKey(projectId))
        // also remove legacy per-field keys if present
        window.sessionStorage.removeItem(this.getEntryKey(projectId) + ":staffCosts")
        window.sessionStorage.removeItem(this.getEntryKey(projectId) + ":nonStaffCosts")
      } catch {
        // ignore
      }
    }
    this.notify(projectId)
  }

  clearAll(): void {
    this.map.clear()
    if (this.options.useSessionCache && this.hasSession()) {
      try {
        const prefix = `${this.options.sessionKeyPrefix}:project:`
        for (let i = 0; i < (window.sessionStorage?.length ?? 0); i++) {
          const key = window.sessionStorage.key(i)
          if (key && key.startsWith(prefix)) window.sessionStorage.removeItem(key)
        }
      } catch {
        // ignore
      }
    }
  }

  persistForm(projectId: string, formId: string, values: any): void {
    if (!this.hasSession() || !this.options.useSessionCache) return
    try {
      window.sessionStorage.setItem(this.getFormKey(projectId, formId), JSON.stringify(values))
    } catch {
      // ignore
    }
  }

  loadForm(projectId: string, formId: string): any | null {
    if (!this.hasSession() || !this.options.useSessionCache) return null
    try {
      const raw = window.sessionStorage.getItem(this.getFormKey(projectId, formId))
      return this.safeParse(raw)
    } catch {
      return null
    }
  }

  removeForm(projectId: string, formId: string): void {
    if (!this.hasSession() || !this.options.useSessionCache) return
    try {
      window.sessionStorage.removeItem(this.getFormKey(projectId, formId))
    } catch {
      // ignore
    }
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

  private notify(projectId: string) {
    const set = this.listeners.get(projectId)
    if (!set) return
    for (const fn of Array.from(set)) {
      try { fn() } catch { /* ignore */ }
    }
  }
}

export const rcptCache = new RcptCacheImpl()
