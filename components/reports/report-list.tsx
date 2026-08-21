// components/duty-reports/duty-report-list.tsx
"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, MapPin, MessageSquare, Image as ImageIcon, Calendar } from "lucide-react"
import { SiteMap } from "../map/site-map"

type DutyReportItem = {
  id: number
  message: string
  is_ok: boolean
  status: string
  status_text: string
  status_color: string
  has_media: boolean
  has_location: boolean
  media_url?: string | null
  media_type?: string | null
  coordinates?: {
    lat: number
    lng: number
  }
  duty_details: {
    title: string
    site_name: string
    site_address: string
    site_location: string
  }
  created_at_formatted: string
  time_ago: string
  guard_name?: string
  guard_code?: string
}

type DutyReportProps = {
  reports: DutyReportItem[]
  pagination?: {
    current_page: number
    last_page: number
    total: number
    per_page: number
  }|null
  onPageChange?: (page: number) => void
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('submitted')) return 'bg-blue-100 text-blue-800';
  if (statusLower.includes('pending')) return 'bg-amber-100 text-amber-800';
  if (statusLower.includes('approved')) return 'bg-green-100 text-green-800';
  if (statusLower.includes('rejected')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};

export function DutyReportList({ reports, pagination, onPageChange }: DutyReportProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      <div className="space-y-3">
        {reports.map((report) => {
          const hasCoordinates = report.has_location && report.coordinates;
          
          return (
            <div key={report.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${report.id}`} className="border-0">
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          {report.is_ok ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="font-medium text-gray-900">{report.duty_details.title}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(report.status)}`}>
                            {report.status_text}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 font-normal">{report.time_ago}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{report.duty_details.site_name}</span>
                        <span className="text-xs text-gray-300">•</span>
                        <span className="text-xs text-gray-500">{report.duty_details.site_location}</span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="px-4 py-4 border-t border-gray-300 bg-gray-50">
                    <div className="space-y-4">
                      {/* Map Section - Show if coordinates available */}
                      {hasCoordinates && (
                        <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                          <SiteMap 
                            latitude={report.coordinates!.lat.toString()} 
                            longitude={report.coordinates!.lng.toString()}
                            siteName={report.duty_details.site_name}
                          />
                        </div>
                      )}

                      {/* Duty Report Details Grid */}
                      <div className="space-y-2">
                        {/* Status */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Status:</span>
                          <span className={`text-sm font-medium ${getStatusColor(report.status)}`}>
                            {report.status_text}
                          </span>
                        </div>

                        {/* Duty Title */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Duty Title:</span>
                          <span className="text-sm font-medium text-gray-900">{report.duty_details.title}</span>
                        </div>

                        {/* Site Name */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Name:</span>
                          <span className="text-sm font-medium text-gray-900">{report.duty_details.site_name}</span>
                        </div>

                        {/* Site Address */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Address:</span>
                          <span className="text-sm font-medium text-gray-900">{report.duty_details.site_address}</span>
                        </div>

                        {/* Site Location */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="text-sm font-medium text-gray-900">{report.duty_details.site_location}</span>
                        </div>

                        {/* Message */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Message:</span>
                          <span className="text-sm font-medium text-gray-900">{report.message}</span>
                        </div>

                        {/* Coordinates */}
                        {hasCoordinates && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Coordinates:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {report.coordinates!.lat}, {report.coordinates!.lng}
                            </span>
                          </div>
                        )}

                        {/* Media Preview */}
                        {report.has_media && report.media_url && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-600">Media:</span>
                            <div className="mt-2 relative h-40 w-full rounded-lg overflow-hidden border border-gray-200">
                              {report.media_type === 'image' ? (
                                <img 
                                  src={report.media_url} 
                                  alt="Report media"
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                                  <ImageIcon className="h-8 w-8 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Created At */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Reported At:</span>
                          <span className="text-sm font-medium text-gray-900">{report.created_at_formatted}</span>
                        </div>

                        {/* Guard Info */}
                        {report.guard_name && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Guard:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {report.guard_name} {report.guard_code && `(${report.guard_code})`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4">
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