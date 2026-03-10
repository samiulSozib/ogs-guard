// components/leave-request/leave-list.tsx
"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import SweetAlertService from "@/lib/sweetAlert"

// Define the actual types from your API response
type GuardDetails = {
  name: string;
  guard_code: string;
  phone: string;
}

type SiteDetails = {
  site_name: string;
  address: string | null;
}

type TransformedLeave = {
  id: number
  leaveerName: string
  guardName: string
  time: string
  startDate: string
  endDate: string
  totalDays: number
  status: string
  note: string
  reviewNote?: string | null
  leaveType: string
  siteName: string
  siteAddress?: string | null
  guardDetails?: GuardDetails
  siteDetails?: SiteDetails
  title?: string
}

type LeaveListProps = {
  leaves: TransformedLeave[]
  onCancelRequest: (id: number) => void  // Renamed from onDelete
  pagination?: {
    current_page: number
    last_page: number
    total: number
    per_page?: number
  }
  onPageChange?: (page: number) => void
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('pending')) return 'bg-amber-100 text-amber-800';
  if (statusLower.includes('approve')) return 'bg-green-100 text-green-800';
  if (statusLower.includes('reject')) return 'bg-red-100 text-red-800';
  if (statusLower.includes('completed')) return 'bg-blue-100 text-blue-800';
  if (statusLower.includes('cancelled')) return 'bg-gray-100 text-gray-800';
  return 'bg-gray-100 text-gray-800';
};

export function LeaveList({ 
  leaves, 
  onCancelRequest,
  pagination,
  onPageChange 
}: LeaveListProps) {
  
  const handleCancelClick = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    
    const result = await SweetAlertService.confirm(
      'Cancel Leave Request',
      'Are you sure you want to cancel this leave request? This action cannot be undone.',
      'Yes, Cancel',
      'No, Keep it'
    )
    
    if (result.isConfirmed) {
      onCancelRequest(id)
    }
  }

  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* Leaves List */}
      <div className="space-y-3">
        {leaves.map((leave) => (
          <div key={leave.id} className="border border-gray-200 rounded-lg overflow-hidden bg-[#FEFDFB]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${leave.id}`} className="border-0">
                {/* Accordion Trigger - Leave Header */}
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-start gap-1">
                      <span className="font-medium text-gray-900">{leave.title || leave.leaveType}</span>
                      <span className="text-sm text-gray-500">{leave.guardName}</span>
                      <span className="text-xs text-gray-400">{leave.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(leave.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Accordion Content - Leave Details */}
                <AccordionContent className="px-6 py-5 bg-white border-t">
                  <div className="space-y-5">

                    {/* Cancel Button - Only show for pending leaves */}
                    {leave.status.toLowerCase() === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white"
                          onClick={(e) => handleCancelClick(leave.id, e)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Cancel Request
                        </Button>
                      </div>
                    )}

                    {/* Leave Details Grid */}
                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-500">Leave Type</p>
                        <p className="text-sm font-medium text-gray-900">{leave.leaveType}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total Days</p>
                        <p className="text-sm font-medium text-gray-900">{leave.totalDays} days</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Start Date</p>
                        <p className="text-sm font-medium text-gray-900">{leave.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">End Date</p>
                        <p className="text-sm font-medium text-gray-900">{leave.endDate}</p>
                      </div>
                      {leave.siteName !== 'N/A' && (
                        <div className="col-span-2">
                          <p className="text-xs text-gray-500">Site</p>
                          <p className="text-sm font-medium text-gray-900">{leave.siteName}</p>
                          {leave.siteAddress && (
                            <p className="text-xs text-gray-500 mt-1">{leave.siteAddress}</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Guard Details (if available) */}
                    {leave.guardDetails && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Guard Details:</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-gray-500">Guard Code</p>
                            <p className="text-sm font-medium">{leave.guardDetails.guard_code}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="text-sm font-medium">{leave.guardDetails.phone}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Reason Note */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm font-semibold text-gray-700 mb-1">Reason:</p>
                      <p className="text-sm text-gray-600">{leave.note}</p>
                    </div>

                    {/* Review Note (if rejected) */}
                    {leave.reviewNote && (
                      <div className="bg-red-50 p-4 rounded-lg">
                        <p className="text-sm font-semibold text-red-700 mb-1">Review Note:</p>
                        <p className="text-sm text-red-600">{leave.reviewNote}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => onPageChange?.(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => onPageChange?.(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(pagination.current_page - 1) * (pagination.per_page || 10) + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(pagination.current_page * (pagination.per_page || 10), pagination.total)}
                </span>{' '}
                of <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="rounded-l-md"
                  onClick={() => onPageChange?.(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {[...Array(pagination.last_page)].map((_, i) => (
                  <Button
                    key={i + 1}
                    variant={pagination.current_page === i + 1 ? "default" : "outline"}
                    className={`px-4 ${
                      pagination.current_page === i + 1 
                        ? 'bg-[#5F0015] text-white hover:bg-[#5F0015]/90' 
                        : ''
                    }`}
                    onClick={() => onPageChange?.(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  className="rounded-r-md"
                  onClick={() => onPageChange?.(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}