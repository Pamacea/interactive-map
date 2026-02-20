"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

const AlertDialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
} | null>(null)

const AlertDialog = ({ open, onOpenChange, children }: AlertDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(open || false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <AlertDialogContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

const AlertDialogContent = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const context = React.useContext(AlertDialogContext)

  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && context?.open) {
        context.onOpenChange(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [context])

  if (!context?.open) return null

  const content = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={() => context.onOpenChange(false)}
      />

      {/* Content */}
      <div
        ref={(ref) => {
          if (ref) {
            // Focus the dialog when it opens
            const focusable = ref.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )
            const firstFocusable = focusable[0] as HTMLElement
            firstFocusable?.focus()
          }
        }}
        className={cn(
          "relative rounded-sm shadow-2xl p-5 max-w-[32vw] z-[100] animate-in fade-in zoom-in-95",
          "bg-obsidian/95 backdrop-blur-md border border-iron",
          className
        )}
        onClick={(e) => e.stopPropagation()}
        {...props}
      >
        {children}
      </div>
    </div>
  )

  // Use portal to render dialog outside of parent containers (e.g., pin popup)
  // This prevents width constraints from parent containers affecting the dialog
  return typeof document !== 'undefined' ? createPortal(content, document.body) : content
}

const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
    {...props}
  />
)

const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-4", className)}
    {...props}
  />
)

const AlertDialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-lg font-semibold text-[var(--color-text-primary)]", className)}
    {...props}
  />
)

const AlertDialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-[var(--color-text-secondary)]", className)}
    {...props}
  />
)

const AlertDialogAction = ({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={cn(
      "inline-flex items-center justify-center rounded-sm px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/50",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      className
    )}
    onClick={onClick}
    {...props}
  />
)

const AlertDialogCancel = ({
  className,
  onClick,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext)

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-1 focus:ring-accent-gold/50",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={(e) => {
        onClick?.(e)
        context?.onOpenChange(false)
      }}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
