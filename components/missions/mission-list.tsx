"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Download, ChevronDown, Circle } from "lucide-react"

type MissionItem = {
  id: number
  title: string
  time: string
  reporter: string
  reporterName: string
  trackingCode: string
  siteName: string
  missionPlace: string
  missionDate: string
  missionTime: string
  missionLocation: string
  missionAddress: string
  document: string
  images: string[]
  note?: string
}

type MissionProps = {
  missions: MissionItem[]
}

export function MissionList({ missions }: MissionProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      {/* Missions List */}
      <div className="space-y-3">
        {missions.map((mission) => (
          <div key={mission.id} className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${mission.id}`} className="border-0">
                {/* Accordion Trigger - Mission Header */}
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                  <div className="flex flex-col items-start gap-1 w-full">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-medium text-gray-900">{mission.title}</span>
                      <span className="text-sm text-gray-500 font-normal">{mission.time}</span>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Accordion Content - Mission Details */}
                <AccordionContent className="px-4 py-4 border-t border-gray-300 bg-gray-50">
                  <div className="space-y-4">
                    {/* Mission Details - Simple vertical list like in image */}
                    <div className="space-y-2">
                      {/* map */}
                      <div className="h-75 w-full bg-amber-100 rounded-2xl p-2">
                        <p>this is for map</p>
                      </div>
                      {/* map */}
                      {/* Reporter */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Reporter:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.reporter}</span>
                      </div>

                      {/* Reporter Name */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Reporter Name:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.reporterName}</span>
                      </div>

                      {/* Tracking code */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Tracking code:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.trackingCode}</span>
                      </div>

                      {/* Site Name */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Site Name:</span>
                        <span className="text-sm font-medium text-gray-900 flex items-center gap-1">
                          {mission.siteName.includes('🟢') ? 'GBR' :
                            mission.siteName.includes('🟡') ? 'Site B' :
                              mission.siteName}
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        </span>
                      </div>

                      {/* Mission Occurred Place */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Mission Occurred Place:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.missionPlace}</span>
                      </div>

                      {/* Mission Date */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Mission Date:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.missionDate}</span>
                      </div>

                      {/* Mission Time */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Mission Time:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.missionTime}</span>
                      </div>

                      {/* Mission Location */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Mission Location:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.missionLocation}</span>
                      </div>

                      {/* Mission Location Address */}
                      <div className="flex justify-between items-start">
                        <span className="text-sm text-gray-600">Mission Location Address:</span>
                        <span className="text-sm font-medium text-gray-900">{mission.missionAddress}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center bg-gray-100 rounded p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                              <img src="/img/avt.png" alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">You</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">On Duty</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-100 rounded p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                              <img src="/img/avt.png" alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Guard name</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">On Duty</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-gray-100 rounded p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                              <img src="/img/avt.png" alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">Guard name</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <span className="text-sm text-gray-600">Day off</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex gap-1 w-full">
                          <button className="flex-1 bg-[#B5A28A] text-white font-semibold py-2 px-4 rounded">
                            List of Reports
                          </button>
                          <button className="flex-1 bg-[#5F0015] text-white font-semibold py-2 px-4 rounded">
                            Incident Report (2)
                          </button>
                        </div>

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