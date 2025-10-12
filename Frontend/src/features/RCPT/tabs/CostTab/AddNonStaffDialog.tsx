import React from "react"
import { useForm, Controller } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

/* Had to make a hardcoded form schema here as the DynamicForm component is not yet implemented */

type AddNonStaffDialogProps = {
  onSubmit: (values: Record<string, any>) => void
  buttonLabel?: string
  buttonClassName?: string
  title?: string
  submitLabel?: string
  initialData?: Record<string, any>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
}

type FormValues = {
  category: string
  subcategory: string
  description?: string
  inKind: boolean
  year1: number
  year2: number
  year3: number
}

const CATEGORY_TO_SUBCATEGORIES: Record<string, string[]> = {
  "Advertising and marketing": [
    "Advertising, Marketing and Promotional Expenses",
  ],
  "Consumable Goods and Supplies": [
    "Consumable Goods",
    "Library",
  ],
  "Data Management": [
    "Computer Software and Services",
    "Computer Software and Services (includes Research Data Management and Software Services)",
  ],
  "Equipment and maintenance and utilities": [
    "Major assets and equipment (>$10,000)/infrastructure costs",
    "Minor Assets and Equipment (Asset < $10,000) Non-Capitalised Equipment",
    "Rental and Hire",
    "Repairs and Maintenance",
    "Utilities and Services",
  ],
  "Expert Services and Consultants and Contractors": [
    "Consultants",
    "Contracted and Temporary Labour",
    "Contracted Services (ex. ICA)",
    "Other Expert Services",
  ],
  "Other consumable service": [
    "Open Access Fees",
    "Professional Memberships and Subscriptions",
  ],
  "PhD Stipends": [
    "Other Student Support (includes PhD Stipends/grants)",
  ],
  "Shared Grant Payments": [
    "Contributions to HEPS",
  ],
  "Travel and entertainment": [
    "Entertainment and Catering",
    "Travel, Staff Development, and Conference Expense",
  ],
}

const CATEGORIES = Object.keys(CATEGORY_TO_SUBCATEGORIES)

export function AddNonStaffDialog({
  onSubmit,
  buttonLabel = "+ Add Non-staff Cost",
  buttonClassName = "bg-[#3B2B26] hover:bg-[#2f231f] text-white",
  title = "Add Non-staff Cost",
  submitLabel = "Save",
  initialData,
  open,
  onOpenChange,
  hideTrigger = false,
}: AddNonStaffDialogProps) {
  const isControlled = typeof open === "boolean"
  const [internalOpen, setInternalOpen] = React.useState(false)
  const actualOpen = isControlled ? (open as boolean) : internalOpen

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
  }

  // Helper to build defaults for add vs edit
  const makeDefaults = (data?: Record<string, any>) => ({
    category: data?.category ?? "",
    subcategory: data?.subcategory ?? "",
    description: data?.description ?? "",
    inKind: Boolean(data?.inKind ?? false),
    year1: Number(data?.year1 ?? 0),
    year2: Number(data?.year2 ?? 0),
    year3: Number(data?.year3 ?? 0),
  })

  const { control, handleSubmit, watch, setValue, reset } = useForm<FormValues>({
    defaultValues: makeDefaults(initialData),
    resetOptions: { keepDefaultValues: true },
  })

  // Reset form every time dialog opens (blank for Add, prefilled for Edit)
  React.useEffect(() => {
    if (actualOpen) {
      reset(makeDefaults(initialData))
    }
  }, [actualOpen, initialData, reset])

  const selectedCategory = watch("category")
  const subcategories = selectedCategory ? (CATEGORY_TO_SUBCATEGORIES[selectedCategory] ?? []) : []

  React.useEffect(() => {
    // Clear subcategory when category changes to a value that doesn't contain current subcategory
    if (!subcategories.includes(watch("subcategory"))) {
      setValue("subcategory", "")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const onSubmitInternal = (vals: FormValues) => {
    const payload = {
      category: String(vals.category || ""),
      subcategory: String(vals.subcategory || ""),
      description: String(vals.description || ""),
      inKind: Boolean(vals.inKind),
      year1: Number(vals.year1 || 0) || 0,
      year2: Number(vals.year2 || 0) || 0,
      year3: Number(vals.year3 || 0) || 0,
    }
    onSubmit(payload)
    setOpen(false)
  }

  return (
    <Dialog open={actualOpen} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button type="button" className={buttonClassName}>
            {buttonLabel}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Fill in the non-staff cost details and click {submitLabel}.</DialogDescription>
        </DialogHeader>

        <form id="add-nonstaff-cost-form" onSubmit={handleSubmit(onSubmitInternal)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Controller
                name="category"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory *</Label>
              <Controller
                name="subcategory"
                control={control}
                rules={{ required: true, validate: (v) => !selectedCategory || subcategories.includes(v) }}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v)}
                    disabled={!selectedCategory}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder={selectedCategory ? "Select subcategory" : "Select category first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Input id="description" placeholder="Describe this cost (optional)" {...field} />
                )}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year1">Year 1</Label>
              <Controller
                name="year1"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input id="year1" type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year2">Year 2</Label>
              <Controller
                name="year2"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input id="year2" type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                )}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year3">Year 3</Label>
              <Controller
                name="year3"
                control={control}
                rules={{ min: 0 }}
                render={({ field }) => (
                  <Input id="year3" type="number" min={0} value={field.value} onChange={(e) => field.onChange(Number(e.target.value))} />
                )}
              />
            </div>

            <div className="flex items-center gap-2 sm:col-span-2 pt-2">
              <Controller
                name="inKind"
                control={control}
                render={({ field }) => (
                  <Checkbox id="inKind" checked={field.value} onCheckedChange={(v) => field.onChange(Boolean(v))} />
                )}
              />
              <Label htmlFor="inKind">In Kind?</Label>
            </div>
          </div>
        </form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form="add-nonstaff-cost-form">
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
