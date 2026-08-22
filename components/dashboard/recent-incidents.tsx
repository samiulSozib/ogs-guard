// components/dashboard/recent-incidents.tsx
import { DashboardIncident } from "@/app/types/dashboard"
import { AlertTriangle, AlertCircle, Info, Clock, MapPin } from "lucide-react"

interface RecentIncidentsProps {
  incidents: DashboardIncident[]
}

const severityColors = {
  critical: "bg-red-100 text-red-700 border-red-200",
  high: "bg-orange-100 text-orange-700 border-orange-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-blue-100 text-blue-700 border-blue-200",
}

const severityIcons = {
  critical: AlertTriangle,
  high: AlertCircle,
  medium: AlertCircle,
  low: Info,
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  investigating: "bg-blue-100 text-blue-700",
  closed: "bg-gray-100 text-gray-700",
}

export function RecentIncidents({ incidents }: RecentIncidentsProps) {
  if (!incidents || incidents.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold uppercase text-muted-foreground">
        Recent Incidents ({incidents.length})
      </h2>

      <div className="space-y-2">
        {incidents.map((incident) => {
          const SeverityIcon = severityIcons[incident.severity as keyof typeof severityIcons] || AlertCircle
          const severityColor = severityColors[incident.severity as keyof typeof severityColors] || severityColors.low
          const statusColor = statusColors[incident.status as keyof typeof statusColors] || statusColors.pending

          return (
            <div
              key={incident.id}
              className="rounded-lg border border-gray-200 bg-white p-4 transition-all hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <SeverityIcon className={`h-4 w-4 ${
                      incident.severity === 'critical' ? 'text-red-500' :
                      incident.severity === 'high' ? 'text-orange-500' :
                      incident.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {incident.title}
                    </h3>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${severityColor}`}>
                      {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor}`}>
                      {incident.status.charAt(0).toUpperCase() + incident.status.slice(1)}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3" />
                      {incident.site_name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {incident.created_at_human}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
