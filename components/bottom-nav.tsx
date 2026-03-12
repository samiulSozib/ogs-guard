// components/bottom-nav.tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  Home,
  Search,
  Sparkles,
  Inbox,
  BarChart3,
  Calendar,
  Users,
  Settings,
  Bell,
} from "lucide-react"

// Enhanced bottom nav items with colors and variants
const bottomNavItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
    color: "from-blue-500 to-cyan-500",
    badge: "3",
  },
  {
    title: "Reports",
    href: "/reports",
    icon: BarChart3,
    color: "from-purple-500 to-pink-500",
    badge: "3",
  },
  {
    title: "Incidents",
    href: "/incidents",
    icon: Bell,
    color: "from-amber-500 to-orange-500",
    badge: "3",
  },
  {
    title: "Missions",
    href: "/missions",
    icon: Calendar,
    color: "from-emerald-500 to-teal-500",
    badge: "10",
  },
  {
    title: "Leave",
    href: "/leave-requests",
    icon: Users,
    color: "from-rose-500 to-red-500",
    badge: "5",
  },
]

interface BottomNavProps {
  className?: string
  variant?: "default" | "glass" | "neumorphic"
}

export function BottomNav({ className, variant = "glass" }: BottomNavProps) {
  const pathname = usePathname()

  // Variant styles
  const variantStyles = {
    default: "bg-background border-t border-border",
    glass: "bg-background/80 backdrop-blur-xl border-t border-white/20 dark:border-white/10 shadow-2xl",
    neumorphic: "bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(255,255,255,0.05)] border-0",
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "md:hidden", // Show only on mobile
        "pb-safe", // For safe area on newer iPhones
        variantStyles[variant],
        className
      )}
    >
      {/* Decorative top gradient line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="relative flex h-20 items-center justify-around px-2 max-w-lg mx-auto">
        {bottomNavItems.map((item, index) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center",
                "flex-1 py-1 px-2",
                "transition-all duration-300",
                "group"
              )}
            >
              {/* Active background indicator */}
              {isActive && variant !== "neumorphic" && (
                <motion.div
                  layoutId="active-nav-bg"
                  className={cn(
                    "absolute inset-0 rounded-2xl",
                    "bg-gradient-to-t from-primary/10 to-transparent"
                  )}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}

              {/* Active top indicator */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-indicator"
                  className={cn(
                    "absolute -top-1 h-1 w-10 rounded-full",
                    "bg-gradient-to-r",
                    item.color || "from-primary to-primary/70"
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}

              {/* Icon container with hover effect */}
              <motion.div
                className={cn(
                  "relative flex h-12 w-12 items-center justify-center rounded-2xl",
                  "transition-all duration-300",
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground group-hover:text-foreground/80",
                  variant === "neumorphic" && isActive && "shadow-inner"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-all duration-300",
                  isActive && "scale-110"
                )} />

                {/* Badge with animation */}
                <AnimatePresence>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className={cn(
                        "absolute -right-1 -top-1",
                        "flex min-w-[1.25rem] h-5 items-center justify-center",
                        "rounded-full px-1 text-[10px] font-bold",
                        "bg-gradient-to-r",
                        item.color || "from-primary to-primary/70",
                        "text-white shadow-lg",
                        "border-2 border-background"
                      )}
                    >
                      
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Label with slide-up animation on active */}
              <motion.span
                className={cn(
                  "text-[10px] font-medium mt-1",
                  "transition-all duration-300",
                  isActive 
                    ? "text-primary opacity-100" 
                    : "text-muted-foreground/70 opacity-70 group-hover:opacity-100"
                )}
                animate={isActive ? { y: 0 } : { y: 0 }}
              >
                {item.title}
              </motion.span>
            </Link>
          )
        })}
      </div>

      {/* Floating action button placeholder (if needed) */}
      {/* <div className="absolute -top-6 left-1/2 -translate-x-1/2">
        <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-primary/70 shadow-lg flex items-center justify-center">
          <Plus className="h-6 w-6 text-white" />
        </div>
      </div> */}
    </nav>
  )
}