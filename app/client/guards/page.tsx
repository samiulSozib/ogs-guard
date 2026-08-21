// app/client/guards/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Loader2, Search, User, MapPin, Shield, Phone, Mail, Star, ChevronRight, Filter } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchGuards, clearGuardsError } from "@/store/slices/client/guardSlice"
import { fetchCurrentClient } from "@/store/slices/client/clientProfileSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import Link from "next/link"
import { GuardFilters } from "@/app/types/client/guard.types"
import { ClientPageHeader } from "@/components/client/client-page-header"
import { getGuardStatus, getGuardDutyStatus, getInitials, formatDate } from "@/components/client/guard/guard-utils"

function ClientGuardsContent() {
  const dispatch = useAppDispatch()
  const { client } = useAppSelector((state) => state.clientProfile)
  const { guards, isLoading, error, pagination } = useAppSelector((state) => state.clientGuards)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<'all' | 'online' | 'offline'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [showStatusFilter, setShowStatusFilter] = useState(false)

  useEffect(() => {
    if (!client) {
      dispatch(fetchCurrentClient())
    }
  }, [dispatch, client])

  useEffect(() => {
    const fetchData = async () => {
      const newFilters: GuardFilters = { 
        status: activeTab === 'all' ? null : activeTab,
        per_page: 10,
        page: currentPage
      }
      if (searchTerm) newFilters.search = searchTerm
      
      await dispatch(fetchGuards(newFilters))
    }
    fetchData()
  }, [dispatch, activeTab, searchTerm, currentPage])

  useEffect(() => {
    if (error) {
      dispatch(clearGuardsError())
    }
  }, [error, dispatch])

  const handleTabChange = (tab: 'all' | 'online' | 'offline') => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading && guards.length === 0) {
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
            title="Guards"
            subtitle="Manage your security guards"
            breadcrumb={[
              { label: "Home" },
              { label: "Guards" }
            ]}
            stats={{ total: pagination?.total || 0, label: "guard" }}
            showSearch={true}
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showFilter={true}
            onFilterClick={() => setShowStatusFilter(!showStatusFilter)}
            filterActive={showStatusFilter}
          />

          {/* Tab Navigation */}
          <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
            {[
              { key: 'all', label: 'All' },
              { key: 'online', label: 'Online' },
              { key: 'offline', label: 'Offline' }
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

          {/* Guards List */}
          {guards.length > 0 ? (
            <div className="space-y-4">
              {guards.map((guard) => {
                const status = getGuardStatus(guard)
                const dutyStatus = getGuardDutyStatus(guard)
                const hasCurrentDuty = !!guard.current_duty
                
                return (
                  <Link key={guard.id} href={`/client/guards/${guard.id}`}>
                    <div className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                      {/* Header with Guard Name and Status */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                            {guard.profile_image ? (
                              <img 
                                src={guard.profile_image} 
                                alt={guard.full_name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-lg font-semibold text-gray-600 dark:text-gray-300">
                                {getInitials(guard.full_name)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {guard.full_name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {guard.guard_code}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.color}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                            {status.label}
                          </span>
                          {hasCurrentDuty && (
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${dutyStatus.color}`}>
                              {dutyStatus.label}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-3 flex flex-wrap gap-4">
                        {guard.phone && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Phone className="h-3 w-3" />
                            <span>{guard.phone}</span>
                          </div>
                        )}
                        {guard.email && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Mail className="h-3 w-3" />
                            <span>{guard.email}</span>
                          </div>
                        )}
                        {guard.rating > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span>{guard.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Current Duty Info */}
                      {hasCurrentDuty && (
                        <div className="mt-3 rounded-lg bg-blue-50 p-3 dark:bg-blue-900/20">
                          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                            Current Duty: {guard.current_duty?.duty_title}
                          </p>
                          <p className="text-xs text-blue-600 dark:text-blue-400">
                            {guard.current_duty?.site_name} • {guard.current_duty?.location?.title}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-blue-500 dark:text-blue-400">
                            <MapPin className="h-3 w-3" />
                            <span>
                              {guard.current_duty?.location?.latitude}, {guard.current_duty?.location?.longitude}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Assigned Sites Count */}
                      {guard.assigned_sites && guard.assigned_sites.length > 0 && (
                        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                          <Shield className="h-3 w-3" />
                          <span>{guard.assigned_sites.length} site{guard.assigned_sites.length !== 1 ? 's' : ''} assigned</span>
                        </div>
                      )}

                      {/* Joined Date */}
                      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        Joined: {formatDate(guard.joined_at)}
                      </div>

                      {/* View Details Link */}
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
              <User className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No guards found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? `No guards matching "${searchTerm}"` : 'No guards available'}
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

export default function ClientGuardsPage() {
  return (
    <ClientGuardedRoute>
      <ClientGuardsContent />
    </ClientGuardedRoute>
  )
}