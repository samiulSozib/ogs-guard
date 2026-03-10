// components/dashboard/task-list.tsx
import { DashboardTask } from "@/app/types/dashboard"
import { CheckCircle, Circle, AlertCircle, Clock } from "lucide-react"

interface TaskListProps {
  tasks: DashboardTask[]
  stats: {
    total: number
    completed: number
    pending: number
  }
}

const priorityColors = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-green-500",
}

const statusIcons = {
  not_started: Circle,
  in_progress: Clock,
  completed: CheckCircle,
}

export function TaskList({ tasks, stats }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl bg-card p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No tasks for today</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Task Summary */}
      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <div className="flex justify-between text-sm">
          <span>Completed: {stats.completed}/{stats.total}</span>
          <span className="text-yellow-500">Pending: {stats.pending}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${(stats.completed / stats.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.completion_status as keyof typeof statusIcons] || Circle
          
          return (
            <div key={task.id} className="rounded-xl bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${
                      task.completion_status === 'completed' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium">{task.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                </div>
                <span className={`text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-gray-500'}`}>
                  {task.priority}
                </span>
              </div>

              {/* Task Requirements */}
              <div className="mt-3 flex flex-wrap gap-2">
                {task.is_mandatory && (
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                    Mandatory
                  </span>
                )}
                {task.requires_confirmation && (
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    ✓ Confirmation
                  </span>
                )}
                {task.requires_photo && (
                  <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                    📸 Photo
                  </span>
                )}
                {task.requires_signature && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                    ✍️ Signature
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}