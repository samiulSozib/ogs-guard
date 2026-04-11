// app/reports/add-incident/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Upload, X, MapPin, FileText, AlertCircle, Loader2, Calendar, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { createIncident } from "@/store/slices/incidentSlice"
import { fetchAssignments } from "@/store/slices/guardAssignmentSlice"
import SweetAlertService from "@/lib/sweetAlert"
import { GuardAssignment } from "@/app/types/guardAssignment"

interface AssignmentOption {
    id: number;
    label: string;
    site_id: number;
    site_name: string;
    site_location_id: number;
    site_location_name: string;
    client_id: number;
    client_name: string;
    duty_title: string;
    duty_date: string;
}

export default function AddIncidentPage() {
    const router = useRouter()
    const dispatch = useAppDispatch()

    const { isLoading: isSubmitting } = useAppSelector((state) => state.incident)
    const { assignments, isLoading: isAssignmentsLoading } = useAppSelector((state) => state.guardAssignment)

    const [documents, setDocuments] = useState<File[]>([])
    const [documentPreviews, setDocumentPreviews] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [selectedAssignment, setSelectedAssignment] = useState<AssignmentOption | null>(null)

    const [formData, setFormData] = useState({
        assignment_id: "",
        title: "",
        incident_type: "",
        severity: "",
        incident_place: "",
        incident_address: "",
        incident_date: "",
        incident_time: "",
        description: "",
        injury_or_damage_note: "",
        conversation_note: "",
        note: ""
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // Get guard info from localStorage
    const getGuardInfo = () => {
        try {
            const userStr = localStorage.getItem('user')
            if (userStr) {
                const user = JSON.parse(userStr)
                return {
                    id: user.id,
                    type: 'guard'
                }
            }
        } catch (error) {
            console.error('Error parsing user from localStorage:', error)
        }
        return { id: null, type: 'guard' }
    }

    // Fetch guard assignments on mount
    useEffect(() => {
        const guardInfo = getGuardInfo()
        if (guardInfo.id) {
            dispatch(fetchAssignments({
                guard_id: guardInfo.id,
                per_page: 100,
                include_guard: true,
                include_duty: true,
                include_site: true
            }))
        }
    }, [dispatch])

    // Transform assignments to dropdown options
    const assignmentOptions: AssignmentOption[] = assignments
        .filter(assignment => assignment.duty && assignment.duty.site)
        .map(assignment => ({
            id: assignment.id,
            label: `${assignment.duty?.title || 'Duty'} - ${assignment.duty?.site?.site_name || 'Site'} (${new Date(assignment.duty?.start_datetime || '').toLocaleDateString()})`,
            site_id: assignment.duty?.site_id || 0,
            site_name: assignment.duty?.site?.site_name || 'Unknown Site',
            site_location_id: assignment.duty?.site_location_id || 0,
            site_location_name: assignment.duty?.site_location?.title || 'Main Location',
            client_id: assignment.duty?.site?.client_id || 0,
            client_name: assignment.duty?.site?.client?.full_name || assignment.duty?.site?.client?.company_name || 'Unknown Client',
            duty_title: assignment.duty?.title || 'Unknown Duty',
            duty_date: assignment.duty?.start_datetime || ''
        }))

    const handleAssignmentChange = (assignmentId: string) => {
        const assignment = assignmentOptions.find(opt => opt.id.toString() === assignmentId)
        if (assignment) {
            setSelectedAssignment(assignment)
            setFormData(prev => ({
                ...prev,
                assignment_id: assignmentId
            }))

            // Auto-fill incident address with site address if available
            const siteAddress = assignments.find(a => a.id === assignment.id)?.duty?.site?.address
            if (siteAddress && !formData.incident_address) {
                setFormData(prev => ({
                    ...prev,
                    incident_address: siteAddress
                }))
            }
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[field]
                return newErrors
            })
        }
    }

    const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const newFiles = Array.from(files)
        const validFiles = newFiles.filter(file => file.size <= 10 * 1024 * 1024)

        if (validFiles.length !== newFiles.length) {
            SweetAlertService.warning('File Size Limit', 'Some files exceed 10MB limit and were not added')
        }

        const newDocuments = [...documents, ...validFiles]
        setDocuments(newDocuments)

        const newPreviews = newDocuments.map(file => URL.createObjectURL(file))
        setDocumentPreviews(newPreviews)
    }

    const removeDocument = (index: number) => {
        const newDocuments = documents.filter((_, i) => i !== index)
        const newPreviews = documentPreviews.filter((_, i) => i !== index)

        URL.revokeObjectURL(documentPreviews[index])

        setDocuments(newDocuments)
        setDocumentPreviews(newPreviews)
    }

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!formData.assignment_id) {
            newErrors.assignment_id = "Please select an assignment"
        }

        if (!formData.title.trim()) {
            newErrors.title = "Title is required"
        } else if (formData.title.trim().length < 3) {
            newErrors.title = "Title must be at least 3 characters"
        }

        if (!formData.incident_type) {
            newErrors.incident_type = "Please select incident type"
        }

        if (!formData.severity) {
            newErrors.severity = "Please select severity level"
        }

        if (!formData.incident_place.trim()) {
            newErrors.incident_place = "Incident place is required"
        }

        if (!formData.incident_address.trim()) {
            newErrors.incident_address = "Incident address is required"
        }

        if (!formData.incident_date) {
            newErrors.incident_date = "Incident date is required"
        }

        if (!formData.incident_time) {
            newErrors.incident_time = "Incident time is required"
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required"
        } else if (formData.description.trim().length < 10) {
            newErrors.description = "Please provide a detailed description (minimum 10 characters)"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            SweetAlertService.warning('Validation Error', 'Please fill all required fields correctly')
            return
        }

        if (!selectedAssignment) {
            SweetAlertService.error('Error', 'Please select a valid assignment')
            return
        }

        const guardInfo = getGuardInfo()
        if (!guardInfo.id) {
            SweetAlertService.error('Error', 'Guard information not found. Please login again.')
            return
        }

        setIsLoading(true)

        try {
            const submitData = new FormData()

            // Add all form fields
            submitData.append('title', formData.title)
            submitData.append('site_id', selectedAssignment.site_id.toString())
            submitData.append('site_location_id', selectedAssignment.site_location_id.toString())
            submitData.append('client_id', selectedAssignment.client_id.toString())
            submitData.append('guard_id', guardInfo.id.toString())
            //   submitData.append('duty_id', formData.assignment_id)
            submitData.append('reporter_type', 'guard')
            submitData.append('reporter_id', guardInfo.id.toString())
            submitData.append('incident_type', formData.incident_type)
            submitData.append('severity', formData.severity)
            submitData.append('incident_place', formData.incident_place)
            submitData.append('incident_address', formData.incident_address)
            submitData.append('incident_date', formData.incident_date)
            const formattedTime = formData.incident_time.includes(':')
                ? `${formData.incident_time}:00`
                : `${formData.incident_time}:00:00`
            submitData.append('incident_time', formattedTime)
            submitData.append('description', formData.description)
            submitData.append('visible_to_client', '1')
            submitData.append('status', 'pending')

            if (formData.injury_or_damage_note) {
                submitData.append('injury_or_damage_note', formData.injury_or_damage_note)
            }
            if (formData.conversation_note) {
                submitData.append('conversation_note', formData.conversation_note)
            }
            if (formData.note) {
                submitData.append('note', formData.note)
            }

            // Append documents
            documents.forEach((doc, index) => {
                submitData.append(`media[${index}]`, doc)
            })

            await dispatch(createIncident(submitData)).unwrap()

            await SweetAlertService.success('Success!', 'Incident report submitted successfully')
            router.push('/incidents')

        } catch (error) {
            console.error('Submit error:', error)
            SweetAlertService.error('Error', typeof error === 'string' ? error : 'Failed to submit incident report')
        } finally {
            setIsLoading(false)
        }
    }

    const incidentTypes = [
        { value: 'fire', label: '🔥 Fire' },
        { value: 'theft', label: '💰 Theft' },
        { value: 'accident', label: '🚗 Accident' },
        { value: 'medical', label: '🏥 Medical Emergency' },
        { value: 'security_breach', label: '🔒 Security Breach' },
        { value: 'vandalism', label: '🎨 Vandalism' },
        { value: 'harassment', label: '📢 Harassment' },
        { value: 'other', label: '📝 Other' }
    ]

    const severityLevels = [
        { value: 'critical', label: '🔴 Critical', color: 'text-red-700 bg-red-50' },
        { value: 'high', label: '🟠 High', color: 'text-orange-700 bg-orange-50' },
        { value: 'medium', label: '🟡 Medium', color: 'text-yellow-700 bg-yellow-50' },
        { value: 'low', label: '🟢 Low', color: 'text-green-700 bg-green-50' },
        { value: 'minor', label: '⚪ Minor', color: 'text-gray-700 bg-gray-50' }
    ]

    return (
        <SidebarProvider
            style={{
                "--sidebar-width": "18rem",
                "--header-height": "3.5rem",
            } as React.CSSProperties}
        >
            <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
            <SidebarInset>
                <SiteHeader />
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 pb-24 sm:px-6 lg:px-8 lg:pb-6">

                    {/* Header with back button */}
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
                            <ArrowLeft className="h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Add Incident Report</h1>
                            <p className="text-sm text-muted-foreground mt-0.5">Fill in the details of the incident</p>
                        </div>
                    </div>

                    <HeaderCard />

                    {/* Form Card */}
                    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
                        <CardContent className="p-4 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Assignment Selection Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <Calendar className="h-5 w-5 text-[#5F0015]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Select Assignment</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <FloatingLabelSelect
                                                label="Select Assignment *"
                                                value={formData.assignment_id}
                                                onChange={(e) => handleAssignmentChange(e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.assignment_id ? 'border-red-500' : ''
                                                    }`}
                                                disabled={isAssignmentsLoading}
                                            >
                                                <option value="" disabled hidden>Select an assignment</option>
                                                {assignmentOptions.map((assignment) => (
                                                    <option key={assignment.id} value={assignment.id}>
                                                        {assignment.label}
                                                    </option>
                                                ))}
                                            </FloatingLabelSelect>
                                            {errors.assignment_id && <p className="mt-1 text-sm text-red-500">{errors.assignment_id}</p>}
                                            {isAssignmentsLoading && (
                                                <p className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                                                    <Loader2 className="h-3 w-3 animate-spin" />
                                                    Loading your assignments...
                                                </p>
                                            )}
                                        </div>

                                        {/* Selected Assignment Details */}
                                        {selectedAssignment && (
                                            <div className="rounded-lg bg-gray-50 p-4 border border-gray-200">
                                                <p className="text-sm font-medium text-gray-700 mb-2">Assignment Details:</p>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                                                    <div>
                                                        <span className="text-gray-500">Client:</span>
                                                        <p className="font-medium text-gray-900">{selectedAssignment.client_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Site:</span>
                                                        <p className="font-medium text-gray-900">{selectedAssignment.site_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Location:</span>
                                                        <p className="font-medium text-gray-900">{selectedAssignment.site_location_name}</p>
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-500">Duty:</span>
                                                        <p className="font-medium text-gray-900">{selectedAssignment.duty_title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Basic Information Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <AlertCircle className="h-5 w-5 text-[#5F0015]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                                        <div className="lg:col-span-2">
                                            <FloatingLabelInput
                                                id="title"
                                                label="Title *"
                                                placeholder="Enter incident title"
                                                value={formData.title}
                                                onChange={(e) => handleInputChange('title', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.title ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                                        </div>

                                        {/* Incident Type */}
                                        <div>
                                            <FloatingLabelSelect
                                                label="Incident Type *"
                                                value={formData.incident_type}
                                                onChange={(e) => handleInputChange('incident_type', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.incident_type ? 'border-red-500' : ''
                                                    }`}
                                            >
                                                <option value="" disabled hidden>Select incident type</option>
                                                {incidentTypes.map((type) => (
                                                    <option key={type.value} value={type.value}>{type.label}</option>
                                                ))}
                                            </FloatingLabelSelect>
                                            {errors.incident_type && <p className="mt-1 text-sm text-red-500">{errors.incident_type}</p>}
                                        </div>

                                        {/* Severity Level */}
                                        <div>
                                            <FloatingLabelSelect
                                                label="Severity Level *"
                                                value={formData.severity}
                                                onChange={(e) => handleInputChange('severity', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.severity ? 'border-red-500' : ''
                                                    }`}
                                            >
                                                <option value="" disabled hidden>Select severity level</option>
                                                {severityLevels.map((level) => (
                                                    <option key={level.value} value={level.value}>{level.label}</option>
                                                ))}
                                            </FloatingLabelSelect>
                                            {errors.severity && <p className="mt-1 text-sm text-red-500">{errors.severity}</p>}
                                        </div>

                                        {/* Incident Date */}
                                        <div>
                                            <FloatingLabelInput
                                                id="incident_date"
                                                label="Incident Date *"
                                                type="date"
                                                value={formData.incident_date}
                                                onChange={(e) => handleInputChange('incident_date', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.incident_date ? 'border-red-500' : ''
                                                    }`}
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                            {errors.incident_date && <p className="mt-1 text-sm text-red-500">{errors.incident_date}</p>}
                                        </div>

                                        {/* Incident Time */}
                                        <div>
                                            <FloatingLabelInput
                                                id="incident_time"
                                                label="Incident Time *"
                                                type="time"
                                                value={formData.incident_time}
                                                onChange={(e) => handleInputChange('incident_time', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.incident_time ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.incident_time && <p className="mt-1 text-sm text-red-500">{errors.incident_time}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Location Details Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <MapPin className="h-5 w-5 text-[#5F0015]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Location Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <FloatingLabelInput
                                                id="incident_place"
                                                label="Incident Place *"
                                                placeholder="e.g., Main Entrance, Parking Lot B, etc."
                                                value={formData.incident_place}
                                                onChange={(e) => handleInputChange('incident_place', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.incident_place ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.incident_place && <p className="mt-1 text-sm text-red-500">{errors.incident_place}</p>}
                                        </div>

                                        <div>
                                            <FloatingLabelInput
                                                id="incident_address"
                                                label="Full Address *"
                                                placeholder="Street address, city, state, zip code"
                                                value={formData.incident_address}
                                                onChange={(e) => handleInputChange('incident_address', e.target.value)}
                                                className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.incident_address ? 'border-red-500' : ''
                                                    }`}
                                            />
                                            {errors.incident_address && <p className="mt-1 text-sm text-red-500">{errors.incident_address}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Incident Details Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <FileText className="h-5 w-5 text-[#5F0015]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Incident Details</h2>
                                    </div>

                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <FloatingLabelTextarea
                                                id="description"
                                                label="Description *"
                                                placeholder="Describe what happened in detail..."
                                                value={formData.description}
                                                onChange={(e) => handleInputChange('description', e.target.value)}
                                                className={`min-h-[120px] border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${errors.description ? 'border-red-500' : ''
                                                    }`}
                                                rows={4}
                                            />
                                            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
                                            <p className="mt-1 text-xs text-gray-500">Minimum 10 characters</p>
                                        </div>

                                        <div>
                                            <FloatingLabelTextarea
                                                id="injury_or_damage_note"
                                                label="Injury or Damage Report"
                                                placeholder="Describe any injuries or damages that occurred..."
                                                value={formData.injury_or_damage_note}
                                                onChange={(e) => handleInputChange('injury_or_damage_note', e.target.value)}
                                                className="min-h-[100px] border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <FloatingLabelTextarea
                                                id="conversation_note"
                                                label="Witness Statements"
                                                placeholder="Record any conversations with witnesses or involved parties..."
                                                value={formData.conversation_note}
                                                onChange={(e) => handleInputChange('conversation_note', e.target.value)}
                                                className="min-h-[100px] border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white"
                                                rows={3}
                                            />
                                        </div>

                                        <div>
                                            <FloatingLabelTextarea
                                                id="note"
                                                label="Additional Notes (Optional)"
                                                placeholder="Any other relevant information..."
                                                value={formData.note}
                                                onChange={(e) => handleInputChange('note', e.target.value)}
                                                className="min-h-[100px] border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-2 pb-2 border-b">
                                        <Upload className="h-5 w-5 text-[#5F0015]" />
                                        <h2 className="text-lg font-semibold text-gray-900">Supporting Documents</h2>
                                    </div>

                                    <div className="flex flex-col gap-4">
                                        <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#5F0015]/30 bg-[#5F0015]/5 py-8 transition-all hover:border-[#5F0015] hover:bg-[#5F0015]/10">
                                            <Plus className="h-5 w-5 text-[#5F0015]" />
                                            <span className="text-sm font-medium text-[#5F0015]">Click to upload documents</span>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,.pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={handleDocumentUpload}
                                            />
                                        </label>
                                        <p className="text-xs text-gray-500 text-center">
                                            Supported formats: JPG, PNG, PDF, DOC (Max 10MB each)
                                        </p>
                                    </div>

                                    {documentPreviews.length > 0 && (
                                        <div className="space-y-3">
                                            <h3 className="text-sm font-medium text-gray-700">Uploaded Files ({documents.length})</h3>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {documentPreviews.map((preview, index) => (
                                                    <div key={index} className="group relative flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 transition-all hover:shadow-md">
                                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#5F0015]/10">
                                                            <FileText className="h-5 w-5 text-[#5F0015]" />
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <p className="truncate text-sm font-medium text-gray-900">
                                                                {documents[index]?.name || `Document ${index + 1}`}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {(documents[index]?.size / 1024).toFixed(1)} KB
                                                            </p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeDocument(index)}
                                                            className="flex-shrink-0 rounded-full bg-red-500 p-1.5 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 focus:opacity-100"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row sm:gap-4">
                                    <Link href="/reports" className="w-full sm:w-auto">
                                        <Button type="button" variant="outline" className="w-full border-gray-300" disabled={isLoading || isSubmitting}>
                                            Cancel
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#5F0015] text-white hover:bg-[#5F0015]/90 sm:w-auto sm:min-w-[180px]"
                                        size="lg"
                                        disabled={isLoading || isSubmitting || !selectedAssignment}
                                    >
                                        {(isLoading || isSubmitting) ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span>Submitting...</span>
                                            </div>
                                        ) : (
                                            'Submit Report'
                                        )}
                                    </Button>
                                </div>

                                <p className="text-xs text-gray-400 text-center">
                                    <span className="text-red-500">*</span> Required fields
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}