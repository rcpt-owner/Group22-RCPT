import React from "react"
import { Button } from "@/components/ui/button"
import { DynamicForm } from "@/components/forms/DynamicForm"
import type { FormSchema } from "@/types/FormSchema"
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

type AddNonStaffDialogProps = {
  formSchema: FormSchema | null
  onSubmit: (values: Record<string, any>) => void
  buttonLabel?: string
  buttonClassName?: string
  title?: string
  submitLabel?: string
  initialData?: Record<string, any>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  onChange?: (values: Record<string, any>) => void
}

export function AddNonStaffDialog({
  formSchema,
  onSubmit,
  buttonLabel = "+ Add Non-staff Cost",
  buttonClassName = "bg-[#3B2B26] hover:bg-[#2f231f] text-white",
  title = "Add Non-staff Cost",
  submitLabel = "Save",
  initialData,
  open,
  onOpenChange,
  hideTrigger = false,
  onChange,
}: AddNonStaffDialogProps) {
  const isControlled = typeof open === "boolean"
  const [internalOpen, setInternalOpen] = React.useState(false)
  const actualOpen = isControlled ? (open as boolean) : internalOpen
  const [formKey, setFormKey] = React.useState(0)

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
    if (next) setFormKey((k) => k + 1) // reset form each open
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

        {formSchema ? (
          <DynamicForm
            key={formKey}
            schema={formSchema}
            onSubmit={(vals) => {
              onSubmit(vals)
              setOpen(false)
            }}
            onChange={onChange}
            card={false}
            initialData={initialData}
            formId={formSchema?.formId || "add-nonstaff-cost-form"}
            hideSubmit
          />
        ) : (
          <p className="text-sm text-muted-foreground">Loading non-staff cost form...</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" form={formSchema?.formId || "add-nonstaff-cost-form"} disabled={!formSchema}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
