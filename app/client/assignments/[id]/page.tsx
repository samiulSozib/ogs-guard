// app/client/assignments/[id]/page.tsx
'use client'

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { 
  Loader2, 
  MapPin, 
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building,
  Navigation,
  TrendingUp
} from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchAssignmentById, clearCurrentAssignment } from "@/store/slices/client/assignmentSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import { SiteMap } from "@/components/map/site-map"
import { ClientPageHeader } from "@/components/client/client-page-header"

function AssignmentDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const assignmentId = Number(params.id)
  
  const { currentAssignment, isLoading } = useAppSelector((state) => state.clientAssignments)

  useEffect(() => {
    if (assignmentId) {
      dispatch(fetchAssignmentById(assignmentId))
    }
    
    return () => {
      dispatch(clearCurrentAssignment())
    }
  }, [dispatch, assignmentId])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Assigned' }
      case 'in_progress':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'In Progress' }
      case 'completed':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Completed' }
      case 'cancelled':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', label: 'Cancelled' }
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: status }
    }
  }

  if (isLoading && !currentAssignment) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex items-center justify-center h-[80vh]">
            <Loader2 className="h-8 w-8 animate-spin text-[#6b0015]" />
          </div>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  if (!currentAssignment) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <AlertCircle className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assignment not found</h2>
            <button
              onClick={() => router.push('/client/assignments')}
              className="flex items-center gap-2 rounded-lg bg-[#6b0015] px-4 py-2 text-white"
            >
              Back to Assignments
            </button>
          </div>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const statusBadge = getStatusBadge(currentAssignment.status)
  const hasValidCoordinates = currentAssignment.site?.latitude && currentAssignment.site?.longitude
  const completionPercentage = currentAssignment.hours_summary?.completion_percentage || 0

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "18rem",
        "--header-height": "3.5rem",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
      <SidebarInset>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">
          
          {/* Header Section using reusable component */}
          <ClientPageHeader
            title={currentAssignment.site?.name || "Assignment Details"}
            breadcrumb={[
              { label: "Home" },
              { label: "Assignments", onClick: () => router.push('/client/assignments') },
              { label: `Assignment #${currentAssignment.id}` }
            ]}
            showBackButton={true}
            onBackClick={() => router.push('/client/assignments')}
            extraActions={
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
            }
          />

          {/* Assignment Details */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column - Assignment Info */}
            <div className="space-y-6">
              {/* Time Information */}
              <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Schedule</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                      <p className="text-gray-900 dark:text-white">{currentAssignment.date}</p>
                      <p className="text-xs text-gray-400">{currentAssignment.day_of_week}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Time</p>
                      <p className="text-gray-900 dark:text-white">{currentAssignment.start_time} - {currentAssignment.end_time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
                      <p className="text-gray-900 dark:text-white">{currentAssignment.duration_hours} hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Information */}
              <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Site Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Site Name</p>
                      <p className="text-gray-900 dark:text-white">{currentAssignment.site?.name}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-gray-900 dark:text-white">{currentAssignment.site?.address}</p>
                    </div>
                  </div>
                  {currentAssignment.location && (
                    <div className="flex items-start gap-3">
                      <Navigation className="mt-0.5 h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                        <p className="text-gray-900 dark:text-white">{currentAssignment.location.title}</p>
                        {currentAssignment.location.description && (
                          <p className="text-xs text-gray-500">{currentAssignment.location.description}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Guard Information */}
              <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Assigned Guard</h2>
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                    {currentAssignment.guard?.profile_image ? (
                      <img 
                        src={currentAssignment.guard.profile_image} 
                        alt={currentAssignment.guard.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-white">{currentAssignment.guard?.name}</p>
                    <p className="text-sm text-gray-500">Code: {currentAssignment.guard?.code}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      {currentAssignment.guard?.phone && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{currentAssignment.guard.phone}</span>
                        </div>
                      )}
                      {currentAssignment.guard?.email && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span>{currentAssignment.guard.email}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-700">Rating: {currentAssignment.guard?.rating || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Maps & Hours */}
            <div className="space-y-6">
              {/* Google Map */}
              {hasValidCoordinates && (
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Location Map</h2>
                  <div className="mb-2 flex items-center gap-1 text-xs text-gray-500">
                    <Navigation className="h-3 w-3" />
                    <span>Lat: {currentAssignment.site?.latitude}, Lng: {currentAssignment.site?.longitude}</span>
                  </div>
                  <SiteMap
                    latitude={currentAssignment.site?.latitude}
                    longitude={currentAssignment.site?.longitude}
                    siteName={currentAssignment.site?.name}
                  />
                </div>
              )}

              {/* Hours Summary */}
              {currentAssignment.hours_summary && (
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Hours Summary</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Expected Hours</span>
                      <span className="font-medium text-gray-900">{currentAssignment.hours_summary.expected_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Actual Hours</span>
                      <span className="font-medium text-gray-900">{currentAssignment.hours_summary.actual_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Break Hours</span>
                      <span className="font-medium text-gray-900">{currentAssignment.hours_summary.break_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Net Hours</span>
                      <span className="font-medium text-gray-900">{currentAssignment.hours_summary.net_hours} hrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Variance</span>
                      <span className={`font-medium ${currentAssignment.hours_summary.variance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {currentAssignment.hours_summary.variance} hrs
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Completion</span>
                        <span>{currentAssignment.hours_summary.completion_percentage}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${completionPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance Status */}
              {currentAssignment.attendance && (
                <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Attendance</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Check In</span>
                      <span className="font-medium text-gray-900">
                        {currentAssignment.attendance.checked_in_at 
                          ? new Date(currentAssignment.attendance.checked_in_at).toLocaleString()
                          : 'Not checked in'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Check Out</span>
                      <span className="font-medium text-gray-900">
                        {currentAssignment.attendance.checked_out_at 
                          ? new Date(currentAssignment.attendance.checked_out_at).toLocaleString()
                          : 'Not checked out'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <div className="flex items-center gap-1">
                        {currentAssignment.attendance.is_completed ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-green-600">Completed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-yellow-600" />
                            <span className="text-yellow-600">In Progress</span>
                          </>
                        )}
                      </div>
                    </div>
                    {currentAssignment.attendance.is_late && (
                      <div className="flex items-center gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Guard was late for this assignment</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function AssignmentDetailsPage() {
  return (
    <ClientGuardedRoute>
      <AssignmentDetailsContent />
    </ClientGuardedRoute>
  )
}