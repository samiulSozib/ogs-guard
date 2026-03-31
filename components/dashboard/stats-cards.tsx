// components/dashboard/stats-cards.tsx
import { DashboardStats } from "@/app/types/dashboard"
import { 
  CalendarCheck, 
  MessageCircle, 
  AlertTriangle, 
  Calendar,
  CheckCircle,
  Briefcase,
  TrendingUp
} from "lucide-react"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const statItems = [
    {
      icon: CalendarCheck,
      label: "Attendance",
      value: `${stats.attendance_days} days`,
      color: "bg-blue-500",
    },
    {
      icon: TrendingUp,
      label: "Completion Rate",
      value: `${stats.completion_rate}%`,
      color: "bg-green-500",
    },
    {
      icon: MessageCircle,
      label: "Messages",
      value: stats.unread_messages,
      color: "bg-purple-500",
      badge: stats.unread_messages > 0 ? "unread" : undefined,
    },
    {
      icon: Calendar,
      label: "Pending Leaves",
      value: stats.pending_leaves,
      color: "bg-yellow-500",
    },
    {
      icon: AlertTriangle,
      label: "Today's Incidents",
      value: stats.today_incidents,
      color: "bg-red-500",
    },
    {
      icon: Briefcase,
      label: "Total Assignments",
      value: stats.total_assignments,
      color: "bg-indigo-500",
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: stats.completed_assignments,
      color: "bg-emerald-500",
    },
    {
      icon: Calendar,
      label: "Upcoming Shifts",
      value: stats.upcoming_shifts_count,
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8">
      {statItems.map((item, index) => (
        <div key={index} className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg ${item.color} p-2 text-white`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-xl font-semibold">{item.value}</p>
            </div>
          </div>
          {item.badge === 'unread' && (
            <span className="mt-2 inline-flex rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">
              {stats.unread_messages} new
            </span>
          )}
        </div>
      ))}
    </div>
  )
}