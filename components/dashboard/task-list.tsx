// components/dashboard/task-list.tsx
import { DashboardTask } from "@/app/types/dashboard"
import { CheckCircle, Circle, Clock, AlertCircle, FileText } from "lucide-react"

interface TaskListProps {
  tasks: DashboardTask[]
  stats: {
    total: number
    completed: number
    pending: number
  }
}

const priorityColors = {
  high: "text-red-500 bg-red-50",
  medium: "text-yellow-500 bg-yellow-50",
  low: "text-green-500 bg-green-50",
}

const priorityLabels = {
  high: "High",
  medium: "Medium", 
  low: "Low",
}

const statusIcons = {
  not_started: Circle,
  in_progress: Clock,
  completed: CheckCircle,
  pending: Clock,
}

const statusLabels = {
  not_started: "Not Started",
  in_progress: "In Progress",
  completed: "Completed",
  pending: "Pending",
}

export function TaskList({ tasks, stats }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-xl bg-card p-8 text-center shadow-sm">
        <CheckCircle className="mx-auto h-12 w-12 text-gray-300" />
        <p className="mt-2 text-sm text-gray-500">No tasks for today</p>
        <p className="text-xs text-gray-400">All caught up! 🎉</p>
      </div>
    )
  }

  const completionPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

  return (
    <div className="space-y-4">
      {/* Task Summary */}
      <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
        <div className="flex justify-between text-sm">
          <span className="text-green-600">Completed: {stats.completed}</span>
          <span className="text-yellow-600">Pending: {stats.pending}</span>
          <span className="text-blue-600">Total: {stats.total}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-200">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {tasks.map((task) => {
          const StatusIcon = statusIcons[task.completion_status as keyof typeof statusIcons] || Circle
          const isCompleted = task.completion_status === 'completed'
          
          return (
            <div key={task.id} className={`rounded-xl bg-card p-4 shadow-sm transition-all hover:shadow-md ${isCompleted ? 'opacity-75' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <StatusIcon className={`h-4 w-4 ${
                      isCompleted ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <p className={`font-medium ${isCompleted ? 'line-through text-gray-500' : ''}`}>
                      {task.title}
                    </p>
                  </div>
                  {task.description && (
                    <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[task.priority as keyof typeof priorityColors] || 'text-gray-500 bg-gray-50'}`}>
                    {priorityLabels[task.priority as keyof typeof priorityLabels] || task.priority}
                  </span>
                  <span className="text-xs text-gray-400">
                    {statusLabels[task.completion_status as keyof typeof statusLabels] || task.completion_status}
                  </span>
                </div>
              </div>

              {/* Task Requirements */}
              {(task.is_mandatory || task.requires_confirmation || task.requires_photo || task.requires_signature) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {task.is_mandatory && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">
                      <AlertCircle className="h-3 w-3" />
                      Mandatory
                    </span>
                  )}
                  {task.requires_confirmation && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                      <CheckCircle className="h-3 w-3" />
                      Confirmation
                    </span>
                  )}
                  {task.requires_photo && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-600">
                      📸 Photo
                    </span>
                  )}
                  {task.requires_signature && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-600">
                      ✍️ Signature
                    </span>
                  )}
                </div>
              )}

              {/* Instruction Type Badge */}
              {task.instruction_type && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    <FileText className="h-3 w-3" />
                    {task.instruction_type}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}