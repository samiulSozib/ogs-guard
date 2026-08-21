// app/client/assignments/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Loader2, Calendar, Clock, MapPin, User, CheckCircle, XCircle, ChevronRight, Shield } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchAssignments, clearAssignmentsError } from "@/store/slices/client/assignmentSlice"
import { fetchCurrentClient } from "@/store/slices/client/clientProfileSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import Link from "next/link"
import { AssignmentFilters } from "@/app/types/client/assignment"
import { ClientPageHeader } from "@/components/client/client-page-header"

function ClientAssignmentsContent() {
  const dispatch = useAppDispatch()
  const { client } = useAppSelector((state) => state.clientProfile)
  const { assignments, isLoading, error, pagination } = useAppSelector((state) => state.clientAssignments)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<'all' | 'current' | 'upcoming' | 'past'>('all')
  const [showDateFilter, setShowDateFilter] = useState(false)
  const [dateRange, setDateRange] = useState({ from: '', to: '' })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!client) {
      dispatch(fetchCurrentClient())
    }
  }, [dispatch, client])

  useEffect(() => {
    const fetchData = async () => {
      const newFilters: AssignmentFilters = { 
        status: activeTab, 
        per_page: 10,
        page: currentPage
      }
      if (searchTerm) newFilters.search = searchTerm
      if (dateRange.from) newFilters.from_date = dateRange.from
      if (dateRange.to) newFilters.to_date = dateRange.to
      
      await dispatch(fetchAssignments(newFilters))
    }
    fetchData()
  }, [dispatch, activeTab, searchTerm, dateRange, currentPage])

  useEffect(() => {
    if (error) {
      dispatch(clearAssignmentsError())
    }
  }, [error, dispatch])

  const handleTabChange = (tab: 'all' | 'current' | 'upcoming' | 'past') => {
    setActiveTab(tab)
    setDateRange({ from: '', to: '' })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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

  const getAssignmentTypeBadge = (isCurrent?: boolean, isUpcoming?: boolean, isPast?: boolean) => {
    if (isCurrent) return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Current' }
    if (isUpcoming) return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Upcoming' }
    if (isPast) return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: 'Past' }
    return null
  }

  if (isLoading && assignments.length === 0) {
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
          
          {/* Header Section */}
          <ClientPageHeader
            title="Guard Assignments"
            breadcrumb={[
              { label: "Home" },
              { label: "Assignments" }
            ]}
            stats={{ total: pagination?.total || 0, label: "assignment" }}
            showSearch={true}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showFilter={true}
            onFilterClick={() => setShowDateFilter(!showDateFilter)}
            filterActive={showDateFilter}
          />

          {/* Date Filter Dropdown */}
          {showDateFilter && (
            <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">From Date</label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm text-gray-700 dark:text-gray-300">To Date</label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 p-2 text-sm dark:border-gray-600 dark:bg-gray-700"
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end gap-2">
                <button
                  onClick={() => {
                    setDateRange({ from: '', to: '' })
                    setShowDateFilter(false)
                    setCurrentPage(1)
                    dispatch(fetchAssignments({ status: activeTab, per_page: 10, page: 1 }))
                  }}
                  className="rounded-lg px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400"
                >
                  Reset
                </button>
                <button
                  onClick={() => {
                    if (dateRange.from && dateRange.to) {
                      setCurrentPage(1)
                      dispatch(fetchAssignments({ 
                        status: activeTab, 
                        from_date: dateRange.from, 
                        to_date: dateRange.to,
                        per_page: 10,
                        page: 1
                      }))
                      setShowDateFilter(false)
                    }
                  }}
                  className="rounded-lg bg-[#6b0015] px-3 py-1 text-sm text-white hover:bg-[#8B0020]"
                >
                  Apply
                </button>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All' },
              { key: 'current', label: 'Current' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key as any)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-b-2 border-[#6b0015] text-[#6b0015] dark:text-[#b9a58b]'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Assignments List */}
          {assignments.length > 0 ? (
            <div className="space-y-4">
              {assignments.map((assignment) => {
                const statusBadge = getStatusBadge(assignment.status)
                const typeBadge = getAssignmentTypeBadge(assignment.is_current, assignment.is_upcoming, assignment.is_past)
                
                return (
                  <Link key={assignment.id} href={`/client/assignments/${assignment.id}`}>
                    <div className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {assignment.date} • {assignment.day_of_week}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {typeBadge && (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeBadge.bg} ${typeBadge.text}`}>
                              {typeBadge.label}
                            </span>
                          )}
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                            {statusBadge.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {assignment.site?.name || 'Site Name'}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <MapPin className="mr-1 inline h-3 w-3" />
                        {assignment.site?.address || 'No address provided'}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <Clock className="h-3 w-3" />
                          <span>{assignment.start_time} - {assignment.end_time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                          <span>Duration: {assignment.duration_hours} hours</span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-3 rounded-lg bg-gray-50 p-3 dark:bg-gray-700/50">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600">
                          {assignment.guard?.profile_image ? (
                            <img 
                              src={assignment.guard.profile_image} 
                              alt={assignment.guard.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">{assignment.guard?.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Code: {assignment.guard?.code}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Rating: {assignment.guard?.rating || 0}</span>
                        </div>
                      </div>

                      {assignment.attendance && (
                        <div className="mt-3 flex items-center gap-4 text-sm">
                          {assignment.attendance.checked_in_at ? (
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Checked in: {new Date(assignment.attendance.checked_in_at).toLocaleTimeString()}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-yellow-600">
                              <Clock className="h-3 w-3" />
                              <span>Not checked in yet</span>
                            </div>
                          )}
                          {assignment.attendance.is_late && (
                            <div className="flex items-center gap-1 text-red-600">
                              <XCircle className="h-3 w-3" />
                              <span>Late</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center text-sm font-medium text-[#6b0015] transition-all group-hover:translate-x-1 dark:text-[#b9a58b]">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-800">
              <Calendar className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No assignments found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? `No assignments matching "${searchTerm}"` : 'No assignments available'}
              </p>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total > pagination.per_page && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button
                onClick={() => handlePageChange(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {pagination.current_page} of {pagination.last_page}
              </span>
              <button
                onClick={() => handlePageChange(pagination.current_page + 1)}
                disabled={pagination.current_page === pagination.last_page}
                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
              >
                Next
              </button>
            </div>
          )}
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function ClientAssignmentsPage() {
  return (
    <ClientGuardedRoute>
      <ClientAssignmentsContent />
    </ClientGuardedRoute>
  )
}