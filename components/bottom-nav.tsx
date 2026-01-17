// components/bottom-nav.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface BottomNavItem {
  title: string
  href: string
  icon: React.ReactNode
}

interface BottomNavProps {
  items: BottomNavItem[]
  className?: string
}

export function BottomNav({ items, className }: BottomNavProps) {
  const pathname = usePathname()

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 border-t backdrop-blur supports-[backdrop-filter]:bg-background/60 bg-white rounded-3xl",
        "md:hidden", // Show only on mobile
        className
      )}
    >
      <div className="flex h-16 items-center justify-around">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-1 px-2 py-3",
                "transition-colors hover:text-foreground",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              {isActive && (
                <div className="absolute -top-1 h-1 w-8 rounded-full bg-primary" />
              )}
              <div className={cn(
                "flex h-6 w-6 items-center justify-center",
                isActive && "text-primary"
              )}>
                {item.icon}
              </div>
              <span className="text-xs font-medium text-[#BF99A1]">{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}