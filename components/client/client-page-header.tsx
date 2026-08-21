// components/client/client-page-header.tsx
'use client'

import { ChevronRight, ArrowLeft, Search, Filter } from "lucide-react"
import { ReactNode } from "react"

interface ClientPageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb: { label: string; href?: string; onClick?: () => void }[]
  showBackButton?: boolean
  onBackClick?: () => void
  showSearch?: boolean
  searchValue?: string
  onSearchChange?: (value: string) => void
  showFilter?: boolean
  onFilterClick?: () => void
  filterActive?: boolean
  extraActions?: ReactNode
  stats?: {
    total: number
    label: string
  }
}

export function ClientPageHeader({
  title,
  subtitle,
  breadcrumb,
  showBackButton = false,
  onBackClick,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  showFilter = false,
  onFilterClick,
  filterActive = false,
  extraActions,
  stats,
}: ClientPageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />
      
      {/* Breadcrumb */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 text-sm text-white/60">
          {breadcrumb.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.onClick || item.href ? (
                <button
                  onClick={item.onClick}
                  className="hover:text-white transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span>{item.label}</span>
              )}
              {index < breadcrumb.length - 1 && (
                <ChevronRight className="h-3 w-3" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Back Button */}
      {showBackButton && onBackClick && (
        <div className="relative z-10 mt-4">
          <button
            onClick={onBackClick}
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      )}

      {/* Title and Stats */}
      <div className="relative z-10 mt-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-white/70">{subtitle}</p>}
            {stats && (
              <p className="mt-1 text-sm text-white/70">
                You have {stats.total} {stats.label}{stats.total !== 1 ? 's' : ''} in total
              </p>
            )}
          </div>
          {extraActions && <div>{extraActions}</div>}
        </div>
      </div>

      {/* Search and Filter Bar */}
      {(showSearch || showFilter) && (
        <div className="relative z-10 mt-4 flex gap-2">
          {showSearch && onSearchChange && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-10 w-full rounded-lg bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>
          )}
          {showFilter && onFilterClick && (
            <button
              onClick={onFilterClick}
              className={`flex h-10 items-center gap-2 rounded-lg px-3 text-sm transition-colors ${
                filterActive 
                  ? 'bg-white/30 text-white' 
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          )}
        </div>
      )}
    </div>
  )
}