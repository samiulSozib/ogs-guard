"use client"

import * as React from "react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Plus } from "lucide-react"

type LeaveItem = {
  leaveerName: string
  time: string
  images: string[]
  note?: string
  status: string
}

type LeaveProps = {
  leaves: LeaveItem[]
}

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('pending')) return 'bg-amber-100 text-amber-800 rounded p-1';
  if (statusLower.includes('approve')) return 'bg-green-100 text-green-800 rounded p-1';
  if (statusLower.includes('reject')) return 'bg-red-100 text-red-800 rounded p-1';
  return 'bg-gray-100 text-gray-800 rounded p-1';
};

export function LeaveList({ leaves }: LeaveProps) {
  return (
    <div className="space-y-4 p-4 max-w-4xl mx-auto">


      {/* Leaves List */}
      <div className="space-y-3">
        {leaves.map((leave: LeaveItem, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden bg-[#FEFDFB]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value={`item-${index}`} className="border-0">
                {/* Accordion Trigger - Leave Header */}
                <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-gray-50/50">
                  <div className="flex justify-between items-center w-full">
                    <div className="flex flex-col items-start gap-1">
                      {/* Use leaveerName as Leave Type */}
                      <span className="font-medium text-gray-900">{leave.leaveerName}</span>
                      {/* Combine date and time if separate fields, or use time if that's what contains both */}
                      <span className="text-sm text-gray-500">{leave.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${getStatusColor(leave?.status)}`}>
                        {leave.status}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>

                {/* Accordion Content - Leave Details */}
                <AccordionContent className="px-6 py-5 bg-white">
                  <div className="space-y-5">

                    {/* Action Buttons */}
<div className="flex gap-2">
  <button className="flex-1 flex items-center justify-center px-2 py-2 rounded-lg bg-green-500 text-white text-sm font-medium hover:bg-green-600">
    Edit
  </button>

  <button className="flex-1 flex items-center justify-center px-2 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600">
    Delete Request
  </button>
</div>



                    {/* Leave Details */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Leave Type:</span>
                        <span className="text-sm font-medium text-gray-900">
                          Annual Leave
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Calculation unit:</span>
                        <span className="text-sm font-medium text-gray-900">
                          Daily
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Start Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          12/07/2025
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">End Date:</span>
                        <span className="text-sm font-medium text-gray-900">
                          12/07/2025
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-600">
                          Pending
                        </span>
                      </div>
                    </div>

                    {/* Note Section */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <span className="text-sm font-semibold text-red-500">
                        Note:
                      </span>
                      <span className="text-sm text-gray-700 ml-1">
                        Contrary to popular belief, Lorem Ipsum is not simply random text.
                      </span>
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