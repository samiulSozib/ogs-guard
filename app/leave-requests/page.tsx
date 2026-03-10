// app/leave-requests/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import { HeaderCard } from "@/components/leave-request/header-card"
import { LeaveList } from "@/components/leave-request/leave-list"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchLeaves, deleteLeave, updateLeaveStatus } from "@/store/slices/leaveSlice"
import SweetAlertService from "@/lib/sweetAlert"
import { Leave } from "@/app/types/leave"

export default function LeavesPage() {
  const dispatch = useAppDispatch()
  const { leaves, isLoading, pagination } = useAppSelector((state) => state.leave)
  const { user } = useAppSelector((state) => state.auth)

  const [currentPage, setCurrentPage] = useState(1)


  const loadLeaves = () => {
    if (user?.id) {
      dispatch(fetchLeaves({
        page: currentPage,
        per_page: 10,
        guard_id: user.id // Filter by current user if needed
      }))
    }
  }

  useEffect(() => {
    loadLeaves()
  }, [dispatch, currentPage])



  const handleDelete = async (id: number) => {
    const result = await SweetAlertService.confirm(
      'Delete Leave Request',
      'Are you sure you want to delete this leave request? This action cannot be undone.',
      'Yes, Delete',
      'Cancel'
    )

    if (result.isConfirmed) {
      try {
        await dispatch(deleteLeave(id)).unwrap()
        SweetAlertService.success('Success!', 'Leave request deleted successfully')
        loadLeaves() // Refresh the list
      } catch (error) {
        SweetAlertService.error('Error', 'Failed to delete leave request')
      }
    }
  }

  const handleCancelRequest = async (id: number) => {
    try {
      // Use updateLeaveStatus with 'cancelled' status
      await dispatch(updateLeaveStatus({
        id,
        payload: { status: 'cancelled' }
      })).unwrap()

      SweetAlertService.success('Success!', 'Leave request cancelled successfully')
      loadLeaves() // Refresh the list
    } catch (error) {
      SweetAlertService.error('Error', 'Failed to cancel leave request')
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Transform API data to match component props
  const transformedLeaves = leaves.map((leave: Leave) => ({
    id: leave.id,
    leaveerName: leave.leave_type_text || leave.leave_type,
    guardName: leave.guard_details?.name || leave.guard_user?.full_name || 'Unknown',
    time: leave.created_at_formatted || new Date(leave.created_at).toLocaleString(),
    startDate: new Date(leave.start_date).toLocaleDateString(),
    endDate: new Date(leave.end_date).toLocaleDateString(),
    totalDays: leave.total_days,
    status: leave.status_text || leave.status,
    note: leave.reason,
    reviewNote: leave.review_note,
    leaveType: leave.leave_type_text || leave.leave_type,
    siteName: leave.site_details?.site_name || leave.site?.site_name || 'N/A',
    siteAddress: leave.site_details?.address || leave.site?.address,
    guardDetails: leave.guard_details,
    siteDetails: leave.site_details
  }))

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
          <Link href="/leave-requests/add-leave">
            <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
              <Plus className="mr-2 h-4 w-4" />
              Add New Leave Request
            </Button>
          </Link>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#5F0015]" />
            </div>
          )}

          {/* Leaves List */}
          {!isLoading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <LeaveList
                leaves={transformedLeaves}
                onCancelRequest={handleCancelRequest}  // Changed from onDelete
                pagination={pagination}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && transformedLeaves.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No leave requests found</p>
              <Link href="/leave-requests/add-leave">
                <Button className="mt-4 bg-[#5F0015] text-white hover:bg-[#5F0015]/90">
                  Create your first leave request
                </Button>
              </Link>
            </div>
          )}
        </main>
        <BottomNav items={bottomNavItems} />
      </SidebarInset>
    </SidebarProvider>
  )
}