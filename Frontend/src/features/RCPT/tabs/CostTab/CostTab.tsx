import React, { useEffect, useState } from "react"
import { CircleDollarSign, Users, Package } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { FormSchema } from "@/types/FormSchema"
import { StaffCostsDataTable } from "./StaffCostsDataTable"
import type { StaffCost } from "./StaffCostsDataTable"
import { AddStaffDialog } from "./AddStaffDialog"
import { AddNonStaffDialog } from "./AddNonStaffDialog"
import { NonStaffCostsDataTable } from "./NonStaffCostsDataTable"
import type { NonStaffCost } from "./NonStaffCostsDataTable"

// CostTab: hosts cost subcomponents and orchestrates data/state for this tab.
// Tables are presentational; CostTab owns state and passes data + callbacks.

type CostTabProps = {
  projectId: string
}

export default function CostTab({ projectId }: CostTabProps) {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
  const [staffRows, setStaffRows] = useState<StaffCost[]>([])

  // Edit state for opening dialog with selected row
  const [editOpen, setEditOpen] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  // Non-staff state
  const [nonStaffRows, setNonStaffRows] = useState<NonStaffCost[]>([])
  const [nsEditOpen, setNsEditOpen] = useState(false)
  const [nsEditIndex, setNsEditIndex] = useState<number | null>(null)

  // --- TMP: session storage for staff rows ---
  // --- Will integrate with backend later ---
  // Temporary per-workspace session storage for staff rows (local to this tab).
  const storageKey = React.useMemo(() => `rcpt:costtab:staff:${projectId}`, [projectId])

  // Non-staff session storage key
  const nsStorageKey = React.useMemo(() => `rcpt:costtab:nonstaff:${projectId}`, [projectId])

  // Load any previously entered rows for this workspace session.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey)
      if (raw) setStaffRows(JSON.parse(raw) as StaffCost[])
    } catch {
      // ignore
    }
  }, [storageKey])

  // Load non-staff rows
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(nsStorageKey)
      if (raw) setNonStaffRows(JSON.parse(raw) as NonStaffCost[])
    } catch {
      // ignore
    }
  }, [nsStorageKey])

  // Persist rows whenever they change (remove key when empty).
  useEffect(() => {
    try {
      if (staffRows.length > 0) {
        sessionStorage.setItem(storageKey, JSON.stringify(staffRows))
      } else {
        sessionStorage.removeItem(storageKey)
      }
    } catch {
      // ignore
    }
  }, [staffRows, storageKey])

  // Persist non-staff rows
  useEffect(() => {
    try {
      if (nonStaffRows.length > 0) {
        sessionStorage.setItem(nsStorageKey, JSON.stringify(nonStaffRows))
      } else {
        sessionStorage.removeItem(nsStorageKey)
      }
    } catch {
      // ignore
    }
  }, [nonStaffRows, nsStorageKey])

  // --- END TMP ---

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const schema: FormSchema = await fetch("/forms/addStaffCostForm.json").then(r => r.json())
        if (!cancelled) setFormSchema(schema)
      } catch (e) {
        // no-op for demo
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Compute year labels from the loaded form schema (fallback to Year 1–3)
  const yearLabels: [string, string, string] = [
    ((formSchema as any)?.fields?.find((f: any) => f.name === "year1")?.label) ?? "Year 1",
    ((formSchema as any)?.fields?.find((f: any) => f.name === "year2")?.label) ?? "Year 2",
    ((formSchema as any)?.fields?.find((f: any) => f.name === "year3")?.label) ?? "Year 3",
  ]

  // Helper mappers
  const toTitle = (s: string | undefined) =>
    (s ?? "").replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase()).trim()
  const mapEmploymentType = (v: string | undefined) => {
    switch ((v ?? "").toLowerCase()) {
      case "full-time": return "Full-Time"
      case "part-time": return "Part-Time"
      case "casual": return "Casual"
      case "contract": return "Contract"
      default: return toTitle(v)
    }
  }

  // FUTURE: integrate with backend data model for a projects length so these years will have to be dynamic
  const mapFormToStaffRow = (values: Record<string, any>): StaffCost => ({
    role: String(values.role ?? ""),
    employmentType: mapEmploymentType(values.employmentType),
    category: toTitle(values.category),
    employmentClassification: toTitle(values.employmentClassification),
    fteType: toTitle(values.fteType),
    year1: Number(values.year1 ?? 0) || 0,
    year2: Number(values.year2 ?? 0) || 0,
    year3: Number(values.year3 ?? 0) || 0,
  })

  // Reverse mapping to prefill form from a StaffCost row
  const staffRowToFormValues = (row: StaffCost) => {
    const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-")
    const normalizeCategory = (c: string) => {
      const v = c.toLowerCase()
      return ["academic", "professional", "technical", "other"].includes(v) ? v : (v === "research" ? "other" : v)
    }
    return {
      role: row.role,
      employmentType: slug(row.employmentType), // e.g., "Full-Time" -> "full-time"
      category: normalizeCategory(row.category),
      employmentClassification: slug(row.employmentClassification), // "Level A" -> "level-a"
      fteType: row.fteType.toLowerCase(), // "FTE" -> "fte"
      year1: row.year1,
      year2: row.year2,
      year3: row.year3,
    }
  }

  // Non-staff helpers
  const mapFormToNonStaffRow = (values: Record<string, any>): NonStaffCost => ({
    category: String(values.category ?? ""),
    subcategory: String(values.subcategory ?? ""),
    description: String(values.description ?? ""),
    inKind: Boolean(values.inKind),
    year1: Number(values.year1 ?? 0) || 0,
    year2: Number(values.year2 ?? 0) || 0,
    year3: Number(values.year3 ?? 0) || 0,
  })
  const nonStaffRowToFormValues = (row: NonStaffCost) => ({
    category: row.category,
    subcategory: row.subcategory,
    description: row.description ?? "",
    inKind: Boolean(row.inKind),
    year1: row.year1,
    year2: row.year2,
    year3: row.year3,
  })

  const handleAddStaff = async (values: Record<string, any>) => {
    const row = mapFormToStaffRow(values)
    setStaffRows(prev => [row, ...prev])
  }

  const handleEditStart = (row: StaffCost) => {
    const idx = staffRows.findIndex(r => r === row)
    if (idx !== -1) {
      setEditIndex(idx)
      setEditOpen(true)
    }
  }

  const handleEditSave = (values: Record<string, any>) => {
    if (editIndex == null) return
    const updated = mapFormToStaffRow(values)
    setStaffRows(prev => prev.map((r, i) => (i === editIndex ? updated : r)))
    setEditOpen(false)
    setEditIndex(null)
  }

  const handleAddNonStaff = (values: Record<string, any>) => {
    const row = mapFormToNonStaffRow(values)
    setNonStaffRows(prev => [row, ...prev])
  }
  const handleNonStaffEditStart = (row: NonStaffCost) => {
    const idx = nonStaffRows.findIndex(r => r === row)
    if (idx !== -1) {
      setNsEditIndex(idx)
      setNsEditOpen(true)
    }
  }
  const handleNonStaffEditSave = (values: Record<string, any>) => {
    if (nsEditIndex == null) return
    const updated = mapFormToNonStaffRow(values)
    setNonStaffRows(prev => prev.map((r, i) => (i === nsEditIndex ? updated : r)))
    setNsEditOpen(false)
    setNsEditIndex(null)
  }

  return (
    <div className="w-full space-y-6">
      {/* Top Section: Costs Planning */}
      <Card className="border rounded-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <CircleDollarSign className="h-6 w-6 " />
            <CardTitle>Costs Planning</CardTitle>
          </div>
          <CardDescription>
            Define the staff and non-staff costs needed for your research project.
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Sub-Tabs: Staff / Non-Staff */}
      <Tabs defaultValue="staff" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="nonstaff" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Non-Staff
          </TabsTrigger>
        </TabsList>

        {/* Main Section (Staff Costs) */}
        <TabsContent value="staff" className="space-y-4 pt-4">
          <Card className="border rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-lg font-medium">Staff Costs:</h3>

              {/* Add dialog (self-triggered) */}
              <AddStaffDialog formSchema={formSchema} onSubmit={handleAddStaff} />
            </CardHeader>

            <CardContent className={staffRows.length === 0 ? "min-h-[220px] flex items-center justify-center text-center" : "p-2 sm:p-4"}>
              {staffRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Users className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No Staff Added Yet.</p>
                </div>
              ) : (
                <>
                  <StaffCostsDataTable
                    data={staffRows}
                    yearLabels={yearLabels}
                    onEdit={handleEditStart}
                    onDelete={(row) => setStaffRows(prev => prev.filter(r => r !== row))}
                  />
                  {/* Edit dialog (controlled, no trigger) */}
                  {editIndex != null && (
                    <AddStaffDialog
                      formSchema={formSchema}
                      onSubmit={handleEditSave}
                      title="Edit Staff Member"
                      submitLabel="Save changes"
                      initialData={staffRowToFormValues(staffRows[editIndex])}
                      open={editOpen}
                      onOpenChange={(o) => {
                        setEditOpen(o)
                        if (!o) setEditIndex(null)
                      }}
                      hideTrigger
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Non-Staff */}
        <TabsContent value="nonstaff" className="space-y-4 pt-4">
          <Card className="border rounded-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <h3 className="text-lg font-medium">Non-Staff Costs:</h3>
              <AddNonStaffDialog onSubmit={handleAddNonStaff} />
            </CardHeader>

            <CardContent className={nonStaffRows.length === 0 ? "min-h-[220px] flex items-center justify-center text-center" : "p-2 sm:p-4"}>
              {nonStaffRows.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3">
                  <Package className="h-10 w-10 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No Non-Staff Costs Added Yet.</p>
                </div>
              ) : (
                <>
                  <NonStaffCostsDataTable
                    data={nonStaffRows}
                    yearLabels={yearLabels}
                    onEdit={handleNonStaffEditStart}
                    onDelete={(row) => setNonStaffRows(prev => prev.filter(r => r !== row))}
                  />
                  {nsEditIndex != null && (
                    <AddNonStaffDialog
                      onSubmit={handleNonStaffEditSave}
                      title="Edit Non-staff Cost"
                      submitLabel="Save changes"
                      initialData={nonStaffRowToFormValues(nonStaffRows[nsEditIndex])}
                      open={nsEditOpen}
                      onOpenChange={(o) => {
                        setNsEditOpen(o)
                        if (!o) setNsEditIndex(null)
                      }}
                      hideTrigger
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}