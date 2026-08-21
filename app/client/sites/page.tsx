// app/client/sites/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Loader2, MapPin, Shield, ChevronRight, Plus, Search, Building } from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchSites, clearSitesError } from "@/store/slices/client/clientSiteSlice"
import { fetchCurrentClient } from "@/store/slices/client/clientProfileSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import Link from "next/link"

function ClientSitesContent() {
    const dispatch = useAppDispatch()
    const { client } = useAppSelector((state) => state.clientProfile)
    const { sites, isLoading, error, pagination } = useAppSelector((state) => state.clientSite)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        if (!client) {
            dispatch(fetchCurrentClient())
        }
        dispatch(fetchSites({ page: currentPage, perPage: 10 }))
    }, [dispatch, client, currentPage])

    useEffect(() => {
        if (error) {
            dispatch(clearSitesError())
        }
    }, [error, dispatch])

    const filteredSites = sites.filter(site =>
        site.site_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (site.address && site.address.toLowerCase().includes(searchTerm.toLowerCase()))
    )

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', label: 'Active' }
            case 'planned':
                return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'Planned' }
            case 'inactive':
                return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: 'Inactive' }
            case 'under_maintenance':
                return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', label: 'Under Maintenance' }
            default:
                return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', label: status }
        }
    }

    if (isLoading && sites.length === 0) {
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
            style={
                {
                    "--sidebar-width": "18rem",
                    "--header-height": "3.5rem",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
            <SidebarInset>
                <SiteHeader />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">

                    {/* Header Section - Same as Dashboard */}
                    <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
                        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />

                        {/* Breadcrumb */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-sm text-white/60">
                                <span>Home</span>
                                <ChevronRight className="h-3 w-3" />
                                <span className="text-white">Sites</span>
                            </div>
                        </div>

                        {/* Title and Stats */}
                        <div className="relative z-10 mt-4">
                            <h1 className="text-2xl font-bold">Sites</h1>
                            <p className="mt-1 text-sm text-white/70">
                                You have {pagination?.total || 0} site{pagination?.total !== 1 ? 's' : ''} in total
                            </p>
                        </div>

                        {/* Search Bar */}
                        <div className="relative z-10 mt-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search sites..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="h-10 w-full rounded-lg bg-white/10 pl-9 pr-4 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sites List */}
                    {filteredSites.length > 0 ? (
                        <div className="space-y-4">
                            {filteredSites.map((site) => {
                                const statusColors = getStatusColor(site.status)
                                return (
                                    <Link key={site.id} href={`/client/sites/${site.id}`}>
                                        <div className="group cursor-pointer rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
                                            {/* Status Badge */}
                                            <div className="mb-3">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                                                    Status: {statusColors.label}
                                                </span>
                                            </div>

                                            {/* Site Name */}
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                Site Name: {site.site_name}
                                            </h3>

                                            {/* Site Instruction */}
                                            {site.site_instruction && (
                                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                    Site Instruction: {site.site_instruction}
                                                </p>
                                            )}

                                            {/* Site Address */}
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Site address: {site.address || 'No address provided'}
                                            </p>

                                            {/* Guards Required */}
                                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                                                Number of guards required: {site.guards_required}
                                            </p>

                                            {/* Guards List */}
                                            {site.guards && site.guards.length > 0 && (
                                                <div className="mt-3 space-y-1">
                                                    {site.guards.map((guard) => (
                                                        <div key={guard.id} className="flex items-center gap-2 text-sm">
                                                            <Shield className="h-3 w-3 text-gray-400" />
                                                            <span className="text-gray-700 dark:text-gray-300">{guard.name}</span>
                                                            <span className="text-xs text-gray-500">•</span>
                                                            <span className="text-xs text-green-600">On Duty</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* If no guards assigned */}
                                            {site.guards_count === 0 && (
                                                <p className="mt-3 text-sm text-gray-400 dark:text-gray-500">
                                                    No guards assigned yet
                                                </p>
                                            )}

                                            {/* Locations Count */}
                                            {site.locations && site.locations.length > 0 && (
                                                <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{site.locations.length} location{site.locations.length !== 1 ? 's' : ''}</span>
                                                </div>
                                            )}

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
                            <Building className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
                            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No sites found</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {searchTerm ? `No sites matching "${searchTerm}"` : 'No sites available'}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.total > pagination.per_page && (
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="rounded-lg border border-gray-300 px-3 py-1 text-sm disabled:opacity-50 dark:border-gray-600"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Page {pagination.current_page} of {pagination.last_page}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                                disabled={currentPage === pagination.last_page}
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

export default function ClientSitesPage() {
    return (
        <ClientGuardedRoute>
            <ClientSitesContent />
        </ClientGuardedRoute>
    )
}