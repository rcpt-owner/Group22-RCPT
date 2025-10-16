import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"
import { X } from "lucide-react"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-80",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        destructive: "border-red-500 bg-red-50 text-red-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <div ref={ref} className={cn(toastVariants({ variant }), className)} {...props} />
  )
})
Toast.displayName = "Toast"

const ToastTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-sm font-semibold", className)} {...props} />
)
ToastTitle.displayName = "ToastTitle"

const ToastDescription = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-sm opacity-90", className)} {...props} />
)
ToastDescription.displayName = "ToastDescription"

const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-500 hover:text-gray-900",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
  </button>
))
ToastClose.displayName = "ToastClose"

export { Toast, ToastTitle, ToastDescription, ToastClose }
