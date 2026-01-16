"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Download, ChevronDown } from "lucide-react"

type IncidentItem = {
  id: number
  title: string
  time: string
  reporter: string
  reporterName: string
  trackingCode: string
  siteName: string
  incidentPlace: string
  incidentDate: string
  incidentTime: string
  incidentLocation: string
  incidentAddress: string
  document: string
  images: string[]
  note?: string
}

type IncidentProps = {
  incidents: IncidentItem[]
}

export function IncidentList({ incidents }: IncidentProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* Incidents List */}
      <div className="space-y-3">
        {incidents.map((incident) => (
          <div key={incident.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${incident.id}`} className="border-0">
                {/* Accordion Trigger - Incident Header */}
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-gray-900">{incident.title}</span>
                      <span className="text-sm text-gray-500 font-normal">{incident.time}</span>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Accordion Content - Incident Details */}
                <AccordionContent className="px-4 py-4 border-t border-gray-300 bg-gray-50">
                  <div className="space-y-4">
                    {/* Incident Details - Simple vertical list like in image */}
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
                          {incident.siteName.includes('🟢') ? 'GBR' :
                            incident.siteName.includes('🟡') ? 'Site B' :
                              incident.siteName}
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </span>
                      </div>

                      {/* Incident Occurred Place */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Incident Occurred Place:</span>
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
                        <span className="text-sm text-gray-600">Incident Location:</span>
                        <span className="text-sm font-medium text-gray-900">{incident.incidentLocation}</span>
                      </div>

                      {/* Incident Location Address */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Incident Location Address:</span>
                        <span className="text-sm font-medium text-gray-900">{incident.incidentAddress}</span>
                      </div>

                      {/* Document */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Document:</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 text-[#5F0015] hover:text-[#5F0015]/80 hover:bg-transparent"
                        >
                          <Download className="h-3 w-3 mr-1" />
                          <span className="text-sm font-medium">Download</span>
                        </Button>
                      </div>
                    </div>




                  </div>
                </AccordionContent>



              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    </div>
  )
}