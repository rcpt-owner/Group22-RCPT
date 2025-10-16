import * as React from "react"

type ToastProps = {
  id?: string
  title?: string
  description?: string
  duration?: number
  variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
  toasts: ToastProps[]
  toast: (props: ToastProps) => void
  removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([])

  const removeToast = (id: string) => {
    setToasts((toasts) => toasts.filter((t) => t.id !== id))
  }

  const toast = React.useCallback((props: ToastProps) => {
    const id = props.id ?? Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...props, id }])
    setTimeout(() => removeToast(id), props.duration ?? 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
