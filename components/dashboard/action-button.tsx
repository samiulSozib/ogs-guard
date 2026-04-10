"use client";

import { LucideIcon } from "lucide-react";
import clsx from "clsx";

type Size = "small" | "medium" | "large";
type Variant = "checkin" | "checkout" | "break" | "default";

export function ActionButton({
  icon: Icon,
  label,
  active = false,
  disabled = false,
  size = "small",
  variant = "default",
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  disabled?: boolean;
  size?: Size;
  variant?: Variant;
  onClick?: () => void;
}) {
  const colors = {
    checkin: {
      active: "bg-green-300 text-black border-emerald-500 shadow-md",
      inactive: "bg-white text-emerald-600 border-emerald-300 hover:bg-emerald-50",
    },
    checkout: {
      active: "bg-red-500 text-white border-red-500 shadow-md",
      inactive: "bg-white text-red-600 border-red-300 hover:bg-red-50",
    },
    break: {
      active: "bg-amber-400 text-white border-amber-400 shadow-md",
      inactive: "bg-white text-amber-600 border-amber-300 hover:bg-amber-50",
    },
    default: {
      active: "bg-gray-800 text-white border-gray-800",
      inactive: "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
    },
  };

  const style = active
    ? colors[variant].active
    : colors[variant].inactive;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "group flex flex-col items-center justify-center rounded-2xl border transition-all duration-200",
        "text-center font-medium",

        // spacing
        size === "large" && "p-6 sm:p-7",
        size === "medium" && "p-4 sm:p-5",
        size === "small" && "p-3 sm:p-4",

        style,

        // hover animation
        !disabled && "hover:-translate-y-1 hover:shadow-lg",

        // disabled
        disabled && "opacity-50 cursor-not-allowed",

        // focus
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
      )}
    >
      <Icon
        className={clsx(
          "mb-2 transition-transform duration-200 group-hover:scale-110",
          size === "large" && "h-8 w-8",
          size === "medium" && "h-6 w-6",
          size === "small" && "h-5 w-5"
        )}
      />

      <span
        className={clsx(
          size === "large" && "text-base",
          size === "medium" && "text-sm",
          size === "small" && "text-xs"
        )}
      >
        {label}
      </span>
    </button>
  );
}