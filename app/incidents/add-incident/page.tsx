// app/reports/add-incident/page.tsx
'use client'

import { useState } from "react"
import { ArrowLeft, Plus, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeaderCard } from "@/components/incidents/header-card"
import { FloatingLabelInput } from "@/components/ui/floating-input"
import { FloatingLabelSelect } from "@/components/ui/floating-select"
import { FloatingLabelTextarea } from "@/components/ui/floating-textarea"

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

                        {/* Incident Time Field */}
                        <div className="space-y-1">
                            <Label className="text-sm font-medium text-gray-900 block">
                                Incident Time
                            </Label>
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    <Input
                                        type="text"
                                        value={formData.incidentTime.split(':')[0] || '00'}
                                        onChange={(e) => {
                                            const hours = e.target.value.padStart(2, '0');
                                            const newTime = `${hours}:${formData.incidentTime.split(':')[1] || '00'}`;
                                            handleTimeChange('time', newTime);
                                        }}
                                        className="w-12 text-center border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                                        maxLength={2}
                                    />
                                    <span className="text-gray-600">:</span>
                                    <Input
                                        type="text"
                                        value={formData.incidentTime.split(':')[1] || '00'}
                                        onChange={(e) => {
                                            const minutes = e.target.value.padStart(2, '0');
                                            const newTime = `${formData.incidentTime.split(':')[0] || '00'}:${minutes}`;
                                            handleTimeChange('time', newTime);
                                        }}
                                        className="w-12 text-center border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                                        maxLength={2}
                                    />
                                </div>
                                <Select value={formData.ampm} onValueChange={(value) => handleTimeChange('ampm', value)}>
                                    <SelectTrigger className="w-24 border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]">
                                        <SelectValue placeholder="PM" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="AM">AM</SelectItem>
                                        <SelectItem value="PM">PM</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Incident Occurred Place Field */}
                        <FloatingLabelInput
                            id="incidentPlace"
                            label="Incident Occurred Place"
                            placeholder="Write here"
                            value={formData.incidentPlace}
                            onChange={(e) => handleInputChange('incidentPlace', e.target.value)}
                            className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                        />

                        {/* Incident Location Address Field */}
                        <FloatingLabelInput
                            id="incidentAddress"
                            label="Incident Location Address"
                            placeholder="Write here"
                            value={formData.incidentAddress}
                            onChange={(e) => handleInputChange('incidentAddress', e.target.value)}
                            className="border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                        />

                        {/* Injury or Damage Note Field */}
                        <FloatingLabelTextarea
                            id="injuryDamage"
                            label="Injury or Damage Note"
                            placeholder="Write here"
                            value={formData.injuryDamage}
                            onChange={(e) => handleInputChange('injuryDamage', e.target.value)}
                            className="min-h-[100px] border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            rows={4}
                        />

                        {/* Conversion With Person Field */}
                        <FloatingLabelTextarea
                            id="conversation"
                            label="Conversion With Person"
                            placeholder="Write here"
                            value={formData.conversation}
                            onChange={(e) => handleInputChange('conversation', e.target.value)}
                            className="min-h-[100px] border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015]"
                            rows={4}
                        />

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
  {/* Add Document Button */}
  <label className="flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-md border-2 border-[#5F0015] bg-transparent py-3 text-[#5F0015] hover:bg-[#5F0015]/5">
    <Plus className="h-4 w-4" />
    <span className="text-sm font-medium">Document</span>
    <input
      type="file"
      multiple
      className="hidden"
      onChange={handleDocumentUpload}
    />
  </label>

  {/* Send Button */}
  <Button
    type="submit"
    className="flex-1 bg-[#5F0015] text-white hover:bg-[#5F0015]/90 py-3"
    size="lg"
  >
    Send
  </Button>
</div>

                        {/* Document Previews - Show below if needed */}
                        {documentPreviews.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h3 className="text-sm font-medium text-gray-700">Uploaded Documents</h3>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                                    {documentPreviews.map((preview, index) => (
                                        <div key={index} className="group relative rounded-md border p-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                    <Upload className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="truncate text-sm font-medium">
                                                        {documents[index]?.name || `Document ${index + 1}`}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {(documents[index]?.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeDocument(index)}
                                                className="absolute -right-2 -top-2 hidden rounded-full bg-red-500 p-1 text-white hover:bg-red-600 group-hover:block"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </form>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}