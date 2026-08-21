// app/incidents/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeaderCard } from "@/components/incidents/header-card"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { IncidentList } from "@/components/incidents/incident-list"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchIncidents } from "@/store/slices/incidentSlice"
import { Incident } from "@/app/types/incident"
import SweetAlertService from "@/lib/sweetAlert"

export default function IncidentsPage() {
  const dispatch = useAppDispatch()
  const { incidents, isLoading, pagination } = useAppSelector((state) => state.incident)
  const [currentPage, setCurrentPage] = useState(1)


    const loadIncidents = () => {
    dispatch(fetchIncidents({
      page: currentPage,
      per_page: 10,
      include_site: true,
      include_client: true,
    }))
  }
  useEffect(() => {
    loadIncidents()
  }, [dispatch, currentPage])



  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDownload = (incidentId: number) => {
    // Implement download logic
    SweetAlertService.info('Download', 'Download feature coming soon')
  }

  // Transform API data to match IncidentItem type
  const transformedIncidents = incidents.map((incident: Incident) => {
    const site = incident.site;
    const client = site?.client;
    const siteLocation = incident.site_location;

    return {
      id: incident.id,
      title: incident.title,
      time: incident.created_at ? new Date(incident.created_at).toLocaleTimeString() : "-",
      reporter: incident.reporter_type === 'guard' ? 'Guard' : incident.reporter_type,
      reporterName: incident.guard_id ? `Guard #${incident.guard_id}` : client?.full_name || "-",
      trackingCode: incident.tracking_code,
      siteName: site?.site_name || "Unknown Site",
      siteAddress: site?.address,
      incidentPlace: incident.incident_place,
      incidentDate: new Date(incident.incident_date).toLocaleDateString(),
      incidentTime: incident.incident_time,
      incidentLocation: siteLocation?.title || "Main Location",
      incidentAddress: incident.incident_address,
      document: incident.media_path || undefined,
      note: incident.description || incident.note || undefined,
      severity: incident.severity,
      status: incident.status,
      latitude: incident.latitude || site?.latitude,
      longitude: incident.longitude || site?.longitude,
      siteDetails: site ? {
        site_name: site.site_name,
        address: site.address,
        latitude: site.latitude,
        longitude: site.longitude,
      } : undefined,
      mediaSummary: incident.media_summary ? {
        has_primary: incident.media_summary.has_primary,
        total_count: incident.media_summary.total_count,
      } : undefined,
    };
  });

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        collapsible="icon"
        className="hidden lg:flex"
      />

      <SidebarInset>
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <HeaderCard />

          {/* Add New Button */}
          <Link href="/incidents/add-incident">
            <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Incident
            </Button>
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#5F0015]" />
            </div>
          )}

          {/* Incidents List */}
          {!isLoading && (
            <div className="">
              <IncidentList
                incidents={transformedIncidents}
                pagination={pagination}
                onPageChange={handlePageChange}
                onDownload={handleDownload}
              />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && transformedIncidents.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No incidents found</p>
              <Link href="/incidents/add-incident">
                <Button className="mt-4 bg-[#5F0015] text-white hover:bg-[#5F0015]/90">
                  Report your first incident
                </Button>
              </Link>
            </div>
          )}
        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
