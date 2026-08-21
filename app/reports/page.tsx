// app/duty-reports/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchDutyReports } from "@/store/slices/dutyReportSlice"
import { DutyReport } from "@/app/types/duty-report.types"
import { HeaderCard } from "@/components/reports/header-card"
import { DutyReportList } from "@/components/reports/report-list"

export default function DutyReportsPage() {
  const dispatch = useAppDispatch()
  const { reports, isLoading, pagination } = useAppSelector((state) => state.dutyReports)
  const [currentPage, setCurrentPage] = useState(1)

  const loadReports = () => {
    dispatch(fetchDutyReports({
      page: currentPage,
      per_page: 10,
    }))
  }

  useEffect(() => {
    loadReports()
  }, [dispatch, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Transform API data to match DutyReportItem type
  const transformedReports = reports.map((report: DutyReport) => {
    return {
      id: report.id,
      message: report.message,
      is_ok: report.is_ok,
      status: report.status,
      status_text: report.status_text,
      status_color: report.status_color,
      has_media: report.has_media,
      has_location: report.has_location,
      media_url: report.media_url,
      media_type: report.media_type,
      coordinates: report.coordinates,
      duty_details: report.duty_details,
      created_at_formatted: report.created_at_formatted,
      time_ago: report.time_ago,
    }
  })

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
          <Link href="/reports/add-report">
            <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Duty Report
            </Button>
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#5F0015]" />
            </div>
          )}

          {/* Reports List */}
          {!isLoading && (
           <div className="">
             <DutyReportList 
              reports={transformedReports}
              pagination={pagination}
              onPageChange={handlePageChange}
            />
           </div>
          )}

          {/* Empty State */}
          {!isLoading && transformedReports.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No duty reports found</p>
              <Link href="/duty-reports/add-report">
                <Button className="mt-4 bg-[#5F0015] text-white hover:bg-[#5F0015]/90">
                  Submit your first duty report
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