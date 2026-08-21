// components/ui/switch.tsx
"use client"

import * as React from "react"
import { Switch as SwitchPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

type SwitchColor = "default" | "red" | "green" | "blue" | "yellow" | "purple" | "orange"

interface SwitchProps extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  size?: "sm" | "default"
  color?: SwitchColor
}

const colorVariants = {
  default: {
    checked: "data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80",
    thumb: "dark:data-[state=checked]:bg-primary-foreground dark:data-[state=unchecked]:bg-foreground"
  },
  red: {
    checked: "data-[state=checked]:bg-red-500 data-[state=unchecked]:bg-red-200 dark:data-[state=unchecked]:bg-red-900/30 hover:data-[state=checked]:bg-red-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-red-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-red-400"
  },
  green: {
    checked: "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-green-200 dark:data-[state=unchecked]:bg-green-900/30 hover:data-[state=checked]:bg-green-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-green-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-green-400"
  },
  blue: {
    checked: "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-blue-200 dark:data-[state=unchecked]:bg-blue-900/30 hover:data-[state=checked]:bg-blue-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-blue-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-blue-400"
  },
  yellow: {
    checked: "data-[state=checked]:bg-yellow-500 data-[state=unchecked]:bg-yellow-200 dark:data-[state=unchecked]:bg-yellow-900/30 hover:data-[state=checked]:bg-yellow-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-yellow-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-yellow-400"
  },
  purple: {
    checked: "data-[state=checked]:bg-purple-500 data-[state=unchecked]:bg-purple-200 dark:data-[state=unchecked]:bg-purple-900/30 hover:data-[state=checked]:bg-purple-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-purple-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-purple-400"
  },
  orange: {
    checked: "data-[state=checked]:bg-orange-500 data-[state=unchecked]:bg-orange-200 dark:data-[state=unchecked]:bg-orange-900/30 hover:data-[state=checked]:bg-orange-600",
    thumb: "data-[state=checked]:bg-white data-[state=unchecked]:bg-orange-500 dark:data-[state=checked]:bg-white dark:data-[state=unchecked]:bg-orange-400"
  }
}

function Switch({
  className,
  size = "default",
  color = "default",
  ...props
}: SwitchProps) {
  const colorStyle = colorVariants[color]

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      data-color={color}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
        "data-[size=default]:h-[18.4px] data-[size=default]:w-[32px]",
        "data-[size=sm]:h-[14px] data-[size=sm]:w-[24px]",
        "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        "data-[state=disabled]:cursor-not-allowed data-[state=disabled]:opacity-50",
        colorStyle.checked,
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-background ring-0 transition-transform",
          "group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3",
          "group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)]",
          "group-data-[size=sm]/switch:data-[state=checked]:translate-x-[calc(100%-2px)]",
          "group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0",
          "group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0",
          colorStyle.thumb
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }