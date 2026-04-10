// components/dashboard/action-button.tsx
import { LucideIcon } from "lucide-react"
import clsx from "clsx"

type Size = "small" | "medium" | "large"
type Variant = "checkin" | "break" | "checkout" | "default"

export function ActionButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  size = "small",
  variant = "default",
  bounce = false,
  isAssignmentAssigned = false,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  disabled?: boolean
  size?: Size
  variant?: Variant
  bounce?: boolean
  isAssignmentAssigned?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || (!active && variant !== "default")}
      className={clsx(
        // Base styles
        "relative flex flex-col items-center justify-center rounded-xl text-center",
        "transition-all duration-200 cursor-pointer",
        "border font-medium w-full",
        
        // Size variants
        size === "large" && "py-5 px-3 gap-2",
        size === "medium" && "py-4 px-3 gap-1.5",
        size === "small" && "py-3 px-2 gap-1",
        
        // Active state styling
        active && variant === "checkin" && !isAssignmentAssigned && 
          "bg-emerald-600 border-emerald-600 text-white shadow-sm",
        active && variant === "checkin" && isAssignmentAssigned && 
          "bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm",
        active && variant === "break" && 
          "bg-amber-500 border-amber-500 text-white shadow-sm",
        active && variant === "checkout" && 
          "bg-rose-600 border-rose-600 text-white shadow-sm",
        
        // Inactive state styling
        !active && variant === "checkin" && 
          "bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:bg-emerald-50",
        !active && variant === "break" && 
          "bg-white border-gray-200 text-gray-500 hover:border-amber-300 hover:bg-amber-50",
        !active && variant === "checkout" && 
          "bg-white border-gray-200 text-gray-500 hover:border-rose-300 hover:bg-rose-50",
        
        // Default variant
        variant === "default" && 
          "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300",
        
        // Disabled state
        disabled && "opacity-60 cursor-not-allowed",
        (!active && variant !== "default") && "opacity-40 cursor-not-allowed",
        
        // Focus ring
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        active && variant === "checkin" && "focus:ring-emerald-400",
        active && variant === "break" && "focus:ring-amber-400",
        active && variant === "checkout" && "focus:ring-rose-400",
        
        // Hover effect
        "hover:shadow-md transition-shadow",
        
        // Bounce animation - applies when bounce is true AND button is active
        bounce && active && "animate-bounce-slow"
      )}
    >
      {/* Icon */}
      <Icon
        className={clsx(
          "transition-transform duration-200",
          size === "large" && "h-6 w-6",
          size === "medium" && "h-5 w-5",
          size === "small" && "h-4 w-4",
          !active && variant !== "default" && "text-gray-400",
          active && variant === "checkin" && isAssignmentAssigned && "text-emerald-600",
          active && variant !== "default" && !(variant === "checkin" && isAssignmentAssigned) && "text-white",
          variant === "default" && "text-gray-500"
        )}
      />
      
      {/* Label */}
      <span
        className={clsx(
          "font-medium",
          size === "large" && "text-sm",
          size === "medium" && "text-xs",
          size === "small" && "text-xs",
          active && variant === "checkin" && isAssignmentAssigned && "text-emerald-700 font-semibold",
          disabled && "opacity-100"
        )}
      >
        {label}
      </span>
      
      {/* Bounce indicator dot */}
      {bounce && active && (
        <span className="absolute -top-1.5 -right-1.5 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600 ring-2 ring-white" />
        </span>
      )}
    </button>
  )
}