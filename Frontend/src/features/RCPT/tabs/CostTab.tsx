import { useEffect, useState } from "react"
import { CircleDollarSign, Users, Package } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import type { FormSchema } from "@/types/FormSchema"
import { StaffCostsDataTable } from "./CostTabFeatures/StaffCostsDataTable"
import { AddStaffDialog } from "./CostTabFeatures/AddStaffDialog"
import { AddNonStaffDialog } from "./CostTabFeatures/AddNonStaffDialog"
import { NonStaffCostsDataTable } from "./CostTabFeatures/NonStaffCostsDataTable"
import { rcptEngine, type StaffCost, type NonStaffCost } from "../rcptEngine"

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

  // New: non-staff schema
  const [nonStaffFormSchema, setNonStaffFormSchema] = useState<FormSchema | null>(null)

  // Remove all sessionStorage based keys/effects. Engine owns persistence.

  // Seed rows from engine on mount and on projectId change (now includes merged form data)
  useEffect(() => {
    let cancelled = false
    rcptEngine
      .loadData(projectId)
      .then(() => {
        if (cancelled) return
        const d = rcptEngine.getProjectData(projectId)
        setStaffRows(d?.staffCosts ?? [])
        setNonStaffRows(d?.nonStaffCosts ?? [])
      })
      .catch(() => {
        // optional: ignore or show toast
      })
    // Subscribe for cross-tab updates
    const unsubscribe = rcptEngine.subscribe(projectId, () => {
      const d = rcptEngine.getProjectData(projectId)
      setStaffRows(d?.staffCosts ?? [])
      setNonStaffRows(d?.nonStaffCosts ?? [])
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [projectId])


  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const base = (import.meta as any)?.env?.BASE_URL ?? "/"
        const schema: FormSchema = await fetch(`${base}forms/addStaffCostForm.json`, { cache: "no-cache" }).then(r => r.json())
        if (!cancelled) setFormSchema(schema)
      } catch (e) {
        // no-op for demo
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Load non-staff form schema
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const base = (import.meta as any)?.env?.BASE_URL ?? "/"
        const schema: FormSchema = await fetch(`${base}forms/addNonStaffCostForm.json`, { cache: "no-cache" }).then(r => r.json())
        if (!cancelled) setNonStaffFormSchema(schema)
      } catch (e) {
        // no-op for demo
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Compute year labels from rcptEngine (dynamic)
  const yearLabels: string[] = rcptEngine.getProjectYears(projectId)

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
  const mapFormToStaffRow = (values: Record<string, any>): StaffCost => {
    const years: Record<string, number> = {}
    if (values.years && typeof values.years === "object") {
      for (const y of yearLabels) years[y] = Number(values.years[y] ?? 0) || 0
    } else {
      for (const y of yearLabels) years[y] = 0
    }
    return {
      role: String(values.role ?? ""),
      employmentType: mapEmploymentType(values.employmentType),
      category: toTitle(values.category),
      employmentClassification: toTitle(values.employmentClassification),
      fteType: toTitle(values.fteType),
      years,
    }
  }

  // Reverse mapping to prefill form from a StaffCost row
  const staffRowToFormValues = (row: StaffCost) => {
    const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-")
    const normalizeCategory = (c: string) => {
      const v = c.toLowerCase()
      return ["academic", "professional", "technical", "other"].includes(v) ? v : (v === "research" ? "other" : v)
    }
    return {
      role: row.role,
      employmentType: slug(row.employmentType),
      category: normalizeCategory(row.category),
      employmentClassification: slug(row.employmentClassification),
      fteType: row.fteType.toLowerCase(),
      years: { ...row.years },
    }
  }

  // Non-staff helpers
  const mapFormToNonStaffRow = (values: Record<string, any>): NonStaffCost => {
    const years: Record<string, number> = {}
    if (values.years && typeof values.years === "object") {
      for (const y of yearLabels) years[y] = Number(values.years[y] ?? 0) || 0
    } else {
      for (const y of yearLabels) years[y] = 0
    }
    return {
      category: String(values.category ?? ""),
      subcategory: String(values.subcategory ?? ""),
      description: String(values.description ?? ""),
      inKind: Boolean(values.inKind),
      years,
    }
  }
  const nonStaffRowToFormValues = (row: NonStaffCost) => ({
    category: row.category,
    subcategory: row.subcategory,
    description: row.description ?? "",
    inKind: Boolean(row.inKind),
    years: { ...row.years },
  })

  const handleAddStaff = async (values: Record<string, any>) => {
    const row = mapFormToStaffRow(values)
    const next = [row, ...staffRows]
    setStaffRows(next)
    rcptEngine.setStaffCosts(projectId, next)
    // clear the draft saved under the add-staff-cost-form id
    rcptEngine.clearFormData(projectId, "add-staff-cost-form")
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
    const next = staffRows.map((r, i) => (i === editIndex ? updated : r))
    setStaffRows(next)
    rcptEngine.setStaffCosts(projectId, next)
    // edits were stored under the same form id; clear that draft
    rcptEngine.clearFormData(projectId, "add-staff-cost-form")
    setEditOpen(false)
    setEditIndex(null)
  }

  const handleAddNonStaff = (values: Record<string, any>) => {
    const row = mapFormToNonStaffRow(values)
    const next = [row, ...nonStaffRows]
    setNonStaffRows(next)
    rcptEngine.setNonStaffCosts(projectId, next)
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
    const next = nonStaffRows.map((r, i) => (i === nsEditIndex ? updated : r))
    setNonStaffRows(next)
    rcptEngine.setNonStaffCosts(projectId, next)
    rcptEngine.clearFormData(projectId, "add-nonstaff-cost-form")
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
              <AddStaffDialog 
                formSchema={formSchema} 
                onSubmit={handleAddStaff}
                projectId={projectId}
                initialData={rcptEngine.loadFormData(projectId, "") || undefined}
                onChange={(values) => rcptEngine.saveFormData(projectId, "add-staff-cost-form", values)}
              />
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
                    onDelete={(row) => {
                      const next = staffRows.filter(r => r !== row)
                      setStaffRows(next)
                      rcptEngine.setStaffCosts(projectId, next)
                    }}
                  />
                  {/* Edit dialog (controlled, no trigger) */}
                  {editIndex != null && (
                    <AddStaffDialog
                      formSchema={formSchema}
                      projectId={projectId}
                      onSubmit={handleEditSave}
                      title="Edit Staff Member"
                      submitLabel="Save changes"
                      initialData={rcptEngine.loadFormData(projectId, "editStaff") || (staffRows[editIndex] ? staffRowToFormValues(staffRows[editIndex]) : undefined)}
                      onChange={(values) => rcptEngine.saveFormData(projectId, "add-staff-cost-form", values)}
                      open={editOpen}
                      onOpenChange={(o) => {
                        setEditOpen(o)
                        if (!o) {
                          setEditIndex(null)
                          rcptEngine.clearFormData(projectId, "editStaff")
                        }
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
              <AddNonStaffDialog 
                formSchema={nonStaffFormSchema} 
                onSubmit={handleAddNonStaff}
                projectId={projectId}
                initialData={rcptEngine.loadFormData(projectId, "addNonStaff") || undefined}
                onChange={(values) => rcptEngine.saveFormData(projectId, "add-nonstaff-cost-form", values)}
              />
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
                    onDelete={(row) => {
                      const next = nonStaffRows.filter(r => r !== row)
                      setNonStaffRows(next)
                      rcptEngine.setNonStaffCosts(projectId, next)
                    }}
                  />
                  {nsEditIndex != null && (
                    <AddNonStaffDialog
                      formSchema={nonStaffFormSchema}
                      onSubmit={handleNonStaffEditSave}
                      title="Edit Non-staff Cost"
                      submitLabel="Save changes"
                      initialData={rcptEngine.loadFormData(projectId, "add-nonstaff-cost-form") || (nonStaffRows[nsEditIndex] ? nonStaffRowToFormValues(nonStaffRows[nsEditIndex]) : undefined)}
                      onChange={(values) => rcptEngine.saveFormData(projectId, "add-nonstaff-cost-form", values)}
                      open={nsEditOpen}
                      projectId={projectId}
                      onOpenChange={(o) => {
                        setNsEditOpen(o)
                        if (!o) {
                          setNsEditIndex(null)
                          rcptEngine.clearFormData(projectId, "add-nonstaff-cost-form")
                        }
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