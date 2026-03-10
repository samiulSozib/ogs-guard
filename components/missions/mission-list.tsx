// components/missions/mission-list.tsx
"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Download, ChevronLeft, ChevronRight, FileText, Image as ImageIcon } from "lucide-react"
import { GuardAssignmentStatusDisplay, GuardAssignmentStatusColor } from "@/app/types/guardAssignment"
import { SiteMap } from "../map/site-map"

type MissionItem = {
  id: number
  title: string
  time: string
  reporter: string
  reporterName: string
  trackingCode: string
  siteName: string
  siteStatus?: string
  missionPlace: string
  missionDate: string
  missionTime: string
  missionLocation: string
  missionAddress: string
  document: string
  images: string[]
  note?: string
  latitude?: string | number
  longitude?: string | number
  guards?: Array<{
    name: string
    status: string
    avatar: string
    isOnline: boolean
  }>
  incidentCount?: number
  reportCount?: number
  // Additional fields from API
  dutyDetails?: {
    title: string
    start_datetime: string
    end_datetime: string
    required_hours: number
    status: string
  }
  siteDetails?: {
    site_name: string
    address: string
    latitude: string
    longitude: string
    client_name: string | null
  }
  current_shift_status?: string
  is_on_break?: boolean
}

type MissionProps = {
  missions: MissionItem[]
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
  return GuardAssignmentStatusColor[statusLower as keyof typeof GuardAssignmentStatusColor] || 'bg-gray-100 text-gray-800';
};

const getStatusDisplay = (status: string) => {
  const statusLower = status.toLowerCase();
  return GuardAssignmentStatusDisplay[statusLower as keyof typeof GuardAssignmentStatusDisplay] || status;
};

const formatDateTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "-";
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString();
};

const formatTime = (dateTimeStr: string) => {
  if (!dateTimeStr) return "-";
  const date = new Date(dateTimeStr);
  return date.toLocaleTimeString();
};

export function MissionList({ missions, pagination, onPageChange }: MissionProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* Missions List */}
      <div className="space-y-3">
        {missions.map((mission) => {
          // Use siteDetails if available, otherwise fallback to mission fields
          const siteDetails = mission.siteDetails;
          const dutyDetails = mission.dutyDetails;
          
          return (
            <div key={mission.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value={`item-${mission.id}`} className="border-0">
                  {/* Accordion Trigger - Mission Header */}
                  <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                    <div className="flex flex-col items-start gap-1 w-full">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium text-gray-900">
                          {dutyDetails?.title || mission.title}
                        </span>
                        <span className="text-sm text-gray-500 font-normal">
                          {mission.time}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  {/* Accordion Content - Mission Details */}
                  <AccordionContent className="px-4 py-4 border-t border-gray-300 bg-gray-50">
                    <div className="space-y-4">
                      {/* Google Map */}
                      <div className="h-75 w-full rounded-2xl overflow-hidden border border-gray-200">
                        <SiteMap 
                          latitude={siteDetails?.latitude || mission.latitude} 
                          longitude={siteDetails?.longitude || mission.longitude}
                          siteName={siteDetails?.site_name || mission.siteName}
                        />
                      </div>

                      {/* Mission Details Grid */}
                      <div className="space-y-2">
                        {/* Reporter - Using guard_user info */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Guard:</span>
                          <span className="text-sm font-medium text-gray-900">{mission.reporterName}</span>
                        </div>

                        {/* Guard Code */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Guard Code:</span>
                          <span className="text-sm font-medium text-gray-900">{mission.trackingCode}</span>
                        </div>

                        {/* Duty Title */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Duty Title:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {dutyDetails?.title || mission.title}
                          </span>
                        </div>

                        {/* Site Name */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Name:</span>
                          <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                            {siteDetails?.site_name || mission.siteName}
                            <span className={`w-2 h-2 rounded-full ${
                              mission.siteStatus === 'active' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></span>
                          </span>
                        </div>

                        {/* Duty Type / Mission Place */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Duty Type:</span>
                          <span className="text-sm font-medium text-gray-900">{mission.missionPlace}</span>
                        </div>

                        {/* Start Date */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Start Date:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(dutyDetails?.start_datetime || mission.missionDate)}
                          </span>
                        </div>

                        {/* End Date */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">End Date:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatDate(dutyDetails?.end_datetime || mission.missionDate)}
                          </span>
                        </div>

                        {/* Start Time */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Start Time:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {formatTime(dutyDetails?.start_datetime || mission.missionTime)}
                          </span>
                        </div>

                        {/* Required Hours */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Required Hours:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {dutyDetails?.required_hours || 8} hours
                          </span>
                        </div>

                        {/* Site Location */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Location:</span>
                          <span className="text-sm font-medium text-gray-900">{mission.missionLocation}</span>
                        </div>

                        {/* Site Address */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Site Address:</span>
                          <span className="text-sm font-medium text-gray-900">
                            {siteDetails?.address || mission.missionAddress}
                          </span>
                        </div>

                        {/* Current Shift Status */}
                        <div className="flex justify-between items-start">
                          <span className="text-sm text-gray-600">Shift Status:</span>
                          <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusColor(mission.current_shift_status || 'not_started')}`}>
                            {getStatusDisplay(mission.current_shift_status || 'not_started')}
                          </span>
                        </div>

                        {/* On Break Status */}
                        {mission.is_on_break !== undefined && (
                          <div className="flex justify-between items-start">
                            <span className="text-sm text-gray-600">On Break:</span>
                            <span className="text-sm font-medium text-gray-900">
                              {mission.is_on_break ? 'Yes' : 'No'}
                            </span>
                          </div>
                        )}

                        {/* Guards List - Using guard_user info */}
                        {mission.guards && mission.guards.length > 0 && (
                          <div className="space-y-2 mt-4">
                            <p className="text-sm font-semibold text-gray-700">Assigned Guards:</p>
                            {mission.guards.map((guard, index) => (
                              <div key={index} className="flex justify-between items-center bg-gray-100 rounded p-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                                    <img 
                                      src={guard.avatar} 
                                      alt={guard.name} 
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = "/img/avt.png";
                                      }}
                                    />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-sm font-medium">{guard.name}</span>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${guard.isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className={`text-sm px-2 py-0.5 rounded-full ${getStatusColor(guard.status)}`}>
                                      {getStatusDisplay(guard.status)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Action Buttons - Commented out as per your request */}
                        {/* <div className="flex flex-col gap-2 w-full mt-4">
                          <div className="flex gap-2 w-full">
                            <Button 
                              className="flex-1 bg-[#B5A28A] text-white font-semibold hover:bg-[#B5A28A]/90"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Reports ({mission.reportCount || 0})
                            </Button>
                            <Button 
                              className="flex-1 bg-[#5F0015] text-white font-semibold hover:bg-[#5F0015]/90"
                            >
                              <ImageIcon className="w-4 h-4 mr-2" />
                              Incidents ({mission.incidentCount || 0})
                            </Button>
                          </div>
                        </div> */}

                        {/* Documents Section */}
                        {/* {mission.document && (
                          <div className="flex items-center justify-between bg-gray-100 rounded p-3 mt-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">{mission.document}</span>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Download className="w-4 h-4" />
                            </Button>
                          </div>
                        )} */}

                        {/* Note Section */}
                        {mission.note && (
                          <div className="bg-blue-50 p-3 rounded-lg mt-2">
                            <p className="text-xs text-gray-600">{mission.note}</p>
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