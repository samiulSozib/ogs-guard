// app/client/sites/[id]/page.tsx
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
  Shield, 
  ChevronRight, 
  ArrowLeft,
  Building,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Navigation,
  Users
} from "lucide-react"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { 
  fetchSiteById, 
  clearCurrentSite,
  fetchSiteLocations
} from "@/store/slices/client/clientSiteSlice"
import ClientGuardedRoute from '@/components/clientGuardedRoute'
import Link from "next/link"
import { SiteMap } from "@/components/map/site-map"

function SiteDetailsContent() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const siteId = Number(params.id)
  
  const { currentSite, isLoading, locations } = useAppSelector((state) => state.clientSite)

  useEffect(() => {
    if (siteId) {
      dispatch(fetchSiteById(siteId))
      dispatch(fetchSiteLocations(siteId))
    }
    
    return () => {
      dispatch(clearCurrentSite())
    }
  }, [dispatch, siteId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400', dot: 'bg-green-500', label: 'Active' }
      case 'planned':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500', label: 'Planned' }
      case 'inactive':
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500', label: 'Inactive' }
      case 'under_maintenance':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-500', label: 'Under Maintenance' }
      default:
        return { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-400', dot: 'bg-gray-500', label: status }
    }
  }

  if (isLoading && !currentSite) {
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

  if (!currentSite) {
    return (
      <SidebarProvider>
        <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-col items-center justify-center h-[80vh] gap-4">
            <Building className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Site not found</h2>
            <button
              onClick={() => router.push('/client/sites')}
              className="flex items-center gap-2 rounded-lg bg-[#6b0015] px-4 py-2 text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Sites
            </button>
          </div>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const statusColors = getStatusColor(currentSite.status)
  const hasValidCoordinates = currentSite.latitude && currentSite.longitude

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
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">
          
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-b-[2.5rem] rounded-t-xl bg-gradient-to-br from-[#2a0008] to-[#6b0015] px-4 pb-5 pt-4 text-white sm:px-5 sm:pb-6">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_45%)]" />
            
            {/* Breadcrumb */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <button onClick={() => router.push('/client/sites')} className="hover:text-white">
                  Sites
                </button>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white">{currentSite.site_name}</span>
              </div>
            </div>

            {/* Back Button */}
            <div className="relative z-10 mt-4">
              <button
                onClick={() => router.push('/client/sites')}
                className="flex items-center gap-2 text-sm text-white/70 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Sites
              </button>
            </div>

            {/* Site Name and Status */}
            <div className="relative z-10 mt-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{currentSite.site_name}</h1>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                  <span className={`mr-1 h-1.5 w-1.5 rounded-full ${statusColors.dot}`} />
                  {statusColors.label}
                </span>
              </div>
            </div>
          </div>

          {/* Site Details Card */}
          <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
            <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Site Information</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Site Name</p>
                  <p className="text-gray-900 dark:text-white">{currentSite.site_name}</p>
                </div>
              </div>

              {currentSite.site_instruction && (
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Site Instruction</p>
                    <p className="text-gray-900 dark:text-white">{currentSite.site_instruction}</p>
                  </div>
                </div>
              )}

              {currentSite.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-gray-900 dark:text-white">{currentSite.address}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <Shield className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Guards Required</p>
                  <p className="text-gray-900 dark:text-white">{currentSite.guards_required}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="mt-0.5 h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Assigned Guards</p>
                  <p className="text-gray-900 dark:text-white">{currentSite.guards_count}</p>
                </div>
              </div>

              {currentSite.created_at && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Created At</p>
                    <p className="text-gray-900 dark:text-white">
                      {new Date(currentSite.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Google Map Section */}
          {hasValidCoordinates && (
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Location Map</h2>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Navigation className="h-3 w-3" />
                  <span>Lat: {currentSite.latitude?.toString()}, Lng: {currentSite.longitude?.toString()}</span>
                </div>
              </div>
              <SiteMap
                latitude={currentSite.latitude?.toString()}
                longitude={currentSite.longitude?.toString()}
                siteName={currentSite.site_name}
              />
            </div>
          )}

          {/* Locations Section */}
          {locations && locations.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Locations ({locations.length})
              </h2>
              <div className="space-y-4">
                {locations.map((location) => (
                  <div key={location.id} className="rounded-lg border border-gray-100 p-4 dark:border-gray-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{location.title}</h3>
                        {location.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{location.description}</p>
                        )}
                        <div className="mt-2 flex flex-wrap gap-4">
                          {location.latitude && location.longitude && (
                            <div className="flex items-center gap-1 text-xs text-gray-400">
                              <Navigation className="h-3 w-3" />
                              <span>{location.latitude?.toString()}, {location.longitude?.toString()}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <div className={`h-1.5 w-1.5 rounded-full ${location.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                            <span className="text-xs text-gray-500">
                              {location.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Location Map for each location */}
                    {location.latitude && location.longitude && (
                      <div className="mt-3">
                        <SiteMap
                          latitude={location.latitude?.toString()}
                          longitude={location.longitude?.toString()}
                          siteName={location.title}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Guards List Section */}
          {currentSite.guards && currentSite.guards.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
              <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Assigned Guards ({currentSite.guards.length})
              </h2>
              <div className="space-y-3">
                {currentSite.guards.map((guard) => (
                  <div key={guard.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3 dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{guard.name}</p>
                        <p className="text-xs text-gray-500">Code: {guard.guard_code}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {guard.is_active ? (
                        <span className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Guards Message */}
          {currentSite.guards_count === 0 && (
            <div className="rounded-xl bg-white p-5 text-center shadow-sm dark:bg-gray-800">
              <Shield className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
              <p className="mt-2 text-gray-500 dark:text-gray-400">No guards assigned to this site yet</p>
            </div>
          )}
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}

export default function SiteDetailsPage() {
  return (
    <ClientGuardedRoute>
      <SiteDetailsContent />
    </ClientGuardedRoute>
  )
}