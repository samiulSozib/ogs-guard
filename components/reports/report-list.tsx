"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Plus } from "lucide-react"

type ReportItem = {
  reporterName: string
  time: string
  images: string[]
  note?: string
}

type ReportProps = {
  reports: ReportItem[]
}

export function ReportList({ reports }: ReportProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">
      

      {/* Reports List */}
      <div className="space-y-3">
        {reports.map((report, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-[#FEFDFB]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className="border-0">
                {/* Accordion Trigger - Report Header */}
                <AccordionTrigger className="px-6 py-3 hover:no-underline hover:bg-gray-50/50">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex items-center gap-4">
                      {/* Reporter Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium">
                        {report.reporterName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-900">{report.reporterName}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500 font-normal">{report.time}</span>
                    
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Accordion Content - Report Details */}
                <AccordionContent className="px-6 py-4 border-t border-gray-200">
                  <div className="space-y-4">
                    {/* Images Grid */}
                    {report.images.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {report.images.map((src, i) => (
                          <div key={i} className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                            <Image
                              src={src}
                              alt={`report image ${i}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-200"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Note Section */}
                    {report.note && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1 h-4 bg-blue-600 rounded-full" />
                          <span className="text-sm font-medium text-gray-700">Note</span>
                        </div>
                        <div className="p-3 bg-[#F4F6F8] rounded-md border border-gray-200">
                          <p className="text-sm text-gray-600 leading-relaxed">{report.note}</p>
                        </div>
                      </div>
                    )}
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