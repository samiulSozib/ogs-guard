// components/incidents/incident-list.tsx
"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, ChevronRight, FileText, AlertCircle } from "lucide-react"
import { Incident } from "@/app/types/incident"
import { SiteMap } from "../map/site-map"

type IncidentItem = {
  id: number
  title: string
  time: string
  reporter: string
  reporterName: string
  trackingCode: string
  siteName: string
  siteAddress?: string
  incidentPlace: string
  incidentDate: string
  incidentTime: string
  incidentLocation: string
  incidentAddress: string
  document?: string
  images?: string[]
  note?: string
  severity?: string
  status?: string
  latitude?: string | number | null
  longitude?: string | number | null
  siteDetails?: {
    site_name: string
    address: string
    latitude?: string
    longitude?: string
  }
  mediaSummary?: {
    has_primary: boolean
    total_count: number
  }
}

type IncidentProps = {
  incidents: IncidentItem[]
  pagination?: {
    current_page: number
    last_page: number
    total: number
    per_page?: number
  }
  onPageChange?: (page: number) => void
  onDownload?: (incidentId: number) => void
}

const getSeverityColor = (severity: string) => {
  const severityLower = severity.toLowerCase();
  if (severityLower.includes('critical')) return 'bg-red-100 text-red-800';
  if (severityLower.includes('high')) return 'bg-orange-100 text-orange-800';
  if (severityLower.includes('medium')) return 'bg-yellow-100 text-yellow-800';
  if (severityLower.includes('low')) return 'bg-green-100 text-green-800';
  return 'bg-gray-100 text-gray-800';
};

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('pending')) return 'bg-amber-100 text-amber-800';
  if (statusLower.includes('resolved')) return 'bg-green-100 text-green-800';
  if (statusLower.includes('dismissed')) return 'bg-gray-100 text-gray-800';
  if (statusLower.includes('investigating')) return 'bg-blue-100 text-blue-800';
  return 'bg-gray-100 text-gray-800';
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return "-";
  if (timeStr.includes('T')) {
    const date = new Date(timeStr);
    return date.toLocaleTimeString();
  }
  return timeStr;
};

export function IncidentList({ incidents, pagination, onPageChange, onDownload }: IncidentProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.map((incident) => {
          const siteName = incident.siteDetails?.site_name || incident.siteName;
          const latitude = incident.latitude || incident.siteDetails?.latitude;
          const longitude = incident.longitude || incident.siteDetails?.longitude;
          
          return (
            <div key={incident.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${incident.id}`} className="border-0">
                  {/* Accordion Trigger - Incident Header */}
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex justify-between items-center w-full">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{incident.title}</span>
                          {incident.severity && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(incident.severity)}`}>
                              {incident.severity}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 font-normal">{incident.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">#{incident.trackingCode}</span>
                        {incident.status && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(incident.status)}`}>
                            {incident.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Accordion Content - Incident Details */}
                  <AccordionContent className="px-4 py-4 border-t border-gray-300 bg-gray-50">
                    <div className="space-y-4">
                      {/* Map Section - Show if coordinates available */}
                      {latitude && longitude && (
                        <div className="h-48 w-full rounded-lg overflow-hidden border border-gray-200">
                          <SiteMap 
                            latitude={latitude.toString()} 
                            longitude={longitude.toString()}
                            siteName={siteName || "Incident Location"}
                          />
                        </div>
                      )}

                      {/* Incident Details Grid */}
                      <div className="space-y-2">
                        {/* Reporter */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Reporter:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.reporter}</span>
                        </div>

                        {/* Reporter Name */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Reporter Name:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.reporterName}</span>
                        </div>

                        {/* Tracking code */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Tracking code:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.trackingCode}</span>
                        </div>

                        {/* Site Name */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Name:</span>
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            {siteName}
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          </span>
                        </div>

                        {/* Site Address */}
                        {incident.siteAddress && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Site Address:</span>
                            <span className="text-sm font-medium text-gray-900">{incident.siteAddress}</span>
                          </div>
                        )}

                        {/* Incident Occurred Place */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Incident Place:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.incidentPlace}</span>
                        </div>

                        {/* Incident Date */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Incident Date:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.incidentDate}</span>
                        </div>

                        {/* Incident Time */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Incident Time:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.incidentTime}</span>
                        </div>

                        {/* Incident Location */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Location:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.incidentLocation}</span>
                        </div>

                        {/* Incident Address */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Address:</span>
                          <span className="text-sm font-medium text-gray-900">{incident.incidentAddress}</span>
                        </div>

                        {/* Document Download */}
                        {incident.document && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Document:</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDownload?.(incident.id)}
                              className="h-auto p-0 text-[#5F0015] hover:text-[#5F0015]/80 hover:bg-transparent"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              <span className="text-sm font-medium">Download</span>
                            </Button>
                          </div>
                        )}

                        {/* Media Summary */}
                        {incident.mediaSummary && incident.mediaSummary.total_count > 0 && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">Media:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {incident.mediaSummary.total_count} file(s)
                            </span>
                          </div>
                        )}

                        {/* Note Section */}
                        {incident.note && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-gray-600">{incident.note}</p>
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