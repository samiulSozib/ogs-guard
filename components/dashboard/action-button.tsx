import { LucideIcon } from "lucide-react"
import clsx from "clsx"

type Size = "small" | "medium" | "large"
type ActiveColor = "green" | "yellow" | "maroon"

export function ActionButton({
  icon: Icon,
  label,
  active,
  size = "small",
  activeColor,
  onClick,
}: {
  icon: LucideIcon
  label: string
  active?: boolean
  size?: Size
  activeColor?: ActiveColor
  onClick?: () => void
}) {
  const activeStyles = {
    green: "bg-green-600 text-white",
    yellow: "bg-yellow-400 text-black",
    maroon: "bg-[#6b0015] text-white",
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "flex flex-col items-center justify-center rounded-2xl text-center transition-all duration-200",
        size === "large" && "p-6",
        size === "medium" && "p-5",
        size === "small" && "p-4",
        active
          ? clsx("scale-110 shadow-lg", activeColor && activeStyles[activeColor])
          : "bg-muted text-muted-foreground hover:bg-muted/80"
      )}
    >
      <Icon
        className={clsx(
          "mb-2",
          size === "large" && "h-8 w-8",
          size === "medium" && "h-7 w-7",
          size === "small" && "h-6 w-6"
        )}
      />
      <span
        className={clsx(
          "font-medium",
          size === "large" && "text-base",
          size === "medium" && "text-sm",
          size === "small" && "text-xs"
        )}
      >
        {label}
      </span>
    </button>
  )
}
