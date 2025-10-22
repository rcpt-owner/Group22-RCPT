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

type AddStaffDialogProps = {
  formSchema: FormSchema | null
  onSubmit: (values: Record<string, any>) => void
  buttonLabel?: string
  buttonClassName?: string
  // New props for edit/controlled usage:
  title?: string
  submitLabel?: string
  initialData?: Record<string, any>
  open?: boolean
  onOpenChange?: (open: boolean) => void
  hideTrigger?: boolean
  onChange?: (values: Record<string, any>) => void
}

export function AddStaffDialog({
  formSchema,
  onSubmit,
  buttonLabel = "+ Add Staff Member",
  buttonClassName = "bg-[#3B2B26] hover:bg-[#2f231f] text-white",
  title = "Add Staff Member",
  submitLabel = "Save",
  initialData,
  open,
  onOpenChange,
  hideTrigger = false,
  onChange,
}: AddStaffDialogProps & { projectId?: string }) {
  // Support controlled or uncontrolled open state
  const isControlled = typeof open === "boolean"
  const [internalOpen, setInternalOpen] = React.useState(false)
  const actualOpen = isControlled ? (open as boolean) : internalOpen
  const [formKey, setFormKey] = React.useState(0)

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next)
    onOpenChange?.(next)
    if (next) setFormKey((k) => k + 1) // reset form each open
  }

  // Get projectId from initialData if available
  const projectId = (initialData && initialData.projectId) || undefined

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
          <DialogDescription>Fill in the staff details and click {submitLabel}.</DialogDescription>
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
            formId={formSchema?.formId || "add-staff-member-form"}
            hideSubmit
            projectId={projectId}
          />
        ) : (
          <p className="text-sm text-muted-foreground">Loading staff member form...</p>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form={formSchema?.formId || "add-staff-member-form"}
            disabled={!formSchema}
          >
            {submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
