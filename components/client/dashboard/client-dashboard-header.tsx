// components/client/client-dashboard-header.tsx
'use client';

import { Client } from "@/app/types/client/client.types"
import { Bell, Building, MapPin, Shield, TrendingUp, Calendar, AlertCircle, ChevronRight } from "lucide-react"
import Link from "next/link"

interface ClientDashboardHeaderProps {
  client: Client | null
  stats: {
    total_sites: number
    active_sites: number
    total_guards: number
    active_guards: number
    total_incidents: number
    open_incidents: number
  }
}

export function ClientDashboardHeader({ client, stats }: ClientDashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
      {/* Decorative Wave */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />

      {/* Top Row with Notification */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-white/10 p-2">
            <Building className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs text-white/60">Client Portal</p>
            <p className="text-sm font-semibold">{client?.company_name || client?.full_name}</p>
          </div>
        </div>
        <button className="relative rounded-full bg-white/10 p-2 transition-all hover:bg-white/20">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#6b0015]" />
        </button>
      </div>

      {/* Welcome Message */}
      <div className="relative z-10 mt-4">
        <h1 className="text-xl font-bold">
          Hi, {client?.full_name?.split(' ')[0] || 'Client'}!
        </h1>
        <p className="mt-1 text-sm text-white/70">
          You currently have {stats.total_sites} active site{stats.total_sites !== 1 ? 's' : ''}.
        </p>
      </div>

      {/* Urgent Notices */}
      <div className="relative z-10 mt-4 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60">Urgent Notices</h3>
        <div className="mt-2 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-3 w-3 text-yellow-400" />
              <span className="text-sm">Incidents</span>
            </div>
            <span className="text-xs text-yellow-400">2 new</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-3 w-3 text-orange-400" />
              <span className="text-sm">Deposit due date</span>
            </div>
            <span className="text-xs text-orange-400">Tomorrow</span>
          </div>
        </div>
      </div>
    </div>
  )
}