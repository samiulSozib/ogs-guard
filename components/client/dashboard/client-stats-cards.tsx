// components/client/client-stats-cards.tsx
'use client';

import { ClientDashboardStats } from "@/app/types/client/dashboard"
import { Building, Shield, AlertTriangle, MessageSquare, TrendingUp, CheckCircle } from "lucide-react"

interface ClientStatsCardsProps {
  stats: ClientDashboardStats
}

export function ClientStatsCards({ stats }: ClientStatsCardsProps) {
  const statItems = [
    {
      icon: Building,
      label: "Total Sites",
      value: stats.total_sites,
      subValue: `${stats.active_sites} Active`,
      color: "bg-blue-500",
    },
    {
      icon: Shield,
      label: "Total Guards",
      value: stats.total_guards,
      subValue: `${stats.active_guards} Active`,
      color: "bg-green-500",
    },
    {
      icon: AlertTriangle,
      label: "Open Incidents",
      value: stats.open_incidents,
      subValue: `${stats.total_incidents} Total`,
      color: "bg-red-500",
    },
    {
      icon: MessageSquare,
      label: "Open Complaints",
      value: stats.total_complaints,
      subValue: `${stats.pending_complaints} Pending`,
      color: "bg-orange-500",
    },
    {
      icon: TrendingUp,
      label: "Response Rate",
      value: "98%",
      subValue: "+2% vs last month",
      color: "bg-purple-500",
    },
    {
      icon: CheckCircle,
      label: "Resolution Rate",
      value: "95%",
      subValue: "Within 24hrs",
      color: "bg-emerald-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {statItems.map((item, index) => (
        <div key={index} className="rounded-lg bg-white p-3 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className={`rounded-lg ${item.color} p-1.5 text-white`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">{item.value}</p>
              {item.subValue && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500">{item.subValue}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}