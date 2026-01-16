// app/reports/add-incident/page.tsx
'use client'

import { useState } from "react"
import { ArrowLeft, Calendar, Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FloatingLabelInput } from "@/components/ui/floating-input"
import { FloatingLabelSelect } from "@/components/ui/floating-select"
import { FloatingLabelTextarea } from "@/components/ui/floating-textarea"
import { HeaderCard } from "@/components/leave-request/header-card"

export default function AddIncidentPage() {
    const [documents, setDocuments] = useState<File[]>([])
    const [documentPreviews, setDocumentPreviews] = useState<string[]>([])
    const [formData, setFormData] = useState({
        title: "",
        site: "",
        incidentDate: "",
        incidentTime: "00:00",
        ampm: "PM",
        incidentPlace: "",
        incidentAddress: "",
        injuryDamage: "",
        conversation: "",
        note: ""
    })

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const handleTimeChange = (type: 'time' | 'ampm', value: string) => {
        if (type === 'time') {
            setFormData(prev => ({
                ...prev,
                incidentTime: value
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                ampm: value
            }))
        }
    }

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        const newDocuments = [...documents, ...newFiles]
        setDocuments(newDocuments)

        // Create previews
        const newPreviews = newDocuments.map(file => URL.createObjectURL(file))
        setDocumentPreviews(newPreviews)
    }

    const removeDocument = (index: number) => {
        const newDocuments = documents.filter((_, i) => i !== index)
        const newPreviews = documentPreviews.filter((_, i) => i !== index)

        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(documentPreviews[index])

        setDocuments(newDocuments)
        setDocumentPreviews(newPreviews)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log("Form submitted:", formData, documents)
        // Here you would typically send data to your backend
        alert("Incident added successfully!")
    }

    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "18rem",
                    "--header-height": "3.5rem",
                } as React.CSSProperties
            }
        >
            {/* Sidebar (WEB ONLY) */}
            <AppSidebar
                variant="inset"
                collapsible="icon"
                className="hidden lg:flex"
            />

            <SidebarInset>
                {/* App Header (ALL VIEWS) */}
                <SiteHeader />

                {/* Add Incident Page Content */}
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">

                    <HeaderCard />

                    {/* Form */}
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6 border-1 p-2 rounded-xl bg-white">

                        {/* Title Field */}
                        <div className="max-w-md">
                            <FloatingLabelInput
                                id="title"
                                label="Title"
                                placeholder="Write a Title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            />
                        </div>

                        {/* Site Field */}
                        <div className="max-w-md">
                            <FloatingLabelSelect
                                label="Site"
                                value={formData.site}
                                onChange={(e) => handleInputChange('site', e.target.value)}
                                className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="site1">Site 1</option>
                                <option value="site2">Site 2</option>
                                <option value="site3">Site 3</option>
                            </FloatingLabelSelect>
                        </div>

                        {/* Incident Date Field */}
                        <div className="max-w-md">
                            <FloatingLabelSelect
                                label="Incident Date"
                                value={formData.incidentDate}
                                onChange={(e) => handleInputChange('incidentDate', e.target.value)}
                                className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            >
                                <option value="" disabled hidden>Select</option>
                                <option value="today">Today</option>
                                <option value="yesterday">Yesterday</option>
                                <option value="custom">Custom Date</option>
                            </FloatingLabelSelect>
                        </div>

                        
<div className="max-w-md">
                            <FloatingLabelInput
                                id="title"
                                label="Title"
                                placeholder="Write a Title"
                                value={formData.title}
                                onChange={(e) => handleInputChange('title', e.target.value)}
                                className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                                postfixIcon={<Calendar/>}
                            />
                        </div>




                        {/* Note (optional) Field */}
                        <FloatingLabelTextarea
                            id="note"
                            label="Note (optional)"
                            placeholder="Write here"
                            value={formData.note}
                            onChange={(e) => handleInputChange('note', e.target.value)}
                            className="min-h-[100px] border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            rows={4}
                        />

                        <hr className="border-gray-300" />

                        {/* Add Document and Send Button Section */}
                        <div className="flex items-center space-x-4">
                           

                            {/* Send Button */}
                            <Button
                                type="submit"
                                className="flex-1 bg-[#5F0015] text-white hover:bg-[#5F0015]/90 py-3"
                                size="lg"
                            >
                                Send Request
                            </Button>
                        </div>

                       
                    </form>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}