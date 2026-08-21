// app/duty-reports/add-report/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Upload, X, MapPin, Loader2, Calendar, MessageSquare, CheckCircle, XCircle, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent } from "@/components/ui/card"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { createDutyReport } from "@/store/slices/dutyReportSlice"
import { fetchAssignments } from "@/store/slices/guardAssignmentSlice"
import SweetAlertService from "@/lib/sweetAlert"
import { GuardAssignment } from "@/app/types/guardAssignment"
import { HeaderCard } from "@/components/reports/header-card"
import { Switch } from "@/components/ui/switch"

interface AssignmentOption {
  id: number;
  label: string;
  duty_title: string;
  site_name: string;
  site_location: string;
}

export default function AddDutyReportPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const { isSubmitting } = useAppSelector((state) => state.dutyReports)
  const { assignments, isLoading: isAssignmentsLoading } = useAppSelector((state) => state.guardAssignment)

  const [documents, setDocuments] = useState<File[]>([])
  const [documentPreviews, setDocumentPreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentOption | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)

  const [formData, setFormData] = useState({
    guard_assignment_id: "",
    message: "",
    is_ok: true,
    latitude: "",
    longitude: "",
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

  // Get current location on mount
  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    
    if (!navigator.geolocation) {
      SweetAlertService.warning('Location Error', 'Geolocation is not supported by your browser')
      setIsGettingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        }))
        setIsGettingLocation(false)
        SweetAlertService.success('Location Retrieved', 'Your current location has been captured')
      },
      (error) => {
        console.error('Location error:', error)
        SweetAlertService.warning('Location Error', 'Unable to get your current location. Please enter coordinates manually.')
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    )
  }

  // Transform assignments to dropdown options
  const assignmentOptions: AssignmentOption[] = assignments
    .filter(assignment => assignment.duty && assignment.duty.site)
    .map(assignment => ({
      id: assignment.id,
      label: `${assignment.duty?.title || 'Duty'} - ${assignment.duty?.site?.site_name || 'Site'} (${new Date(assignment.duty?.start_datetime || '').toLocaleDateString()})`,
      duty_title: assignment.duty?.title || 'Unknown Duty',
      site_name: assignment.duty?.site?.site_name || 'Unknown Site',
      site_location: assignment.duty?.site_location?.title || 'Main Location',
    }))

  const handleAssignmentChange = (assignmentId: string) => {
    const assignment = assignmentOptions.find(opt => opt.id.toString() === assignmentId)
    if (assignment) {
      setSelectedAssignment(assignment)
      setFormData(prev => ({
        ...prev,
        guard_assignment_id: assignmentId
      }))
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
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

    if (!formData.guard_assignment_id) {
      newErrors.guard_assignment_id = "Please select an assignment"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 3) {
      newErrors.message = "Message must be at least 3 characters"
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

    setIsLoading(true)

    try {
      const submitData = {
        guard_assignment_id: parseInt(formData.guard_assignment_id),
        message: formData.message,
        is_ok: formData.is_ok,
        latitude: formData.latitude || '0',
        longitude: formData.longitude || '0',
        media_file: documents.length > 0 ? documents[0] : undefined,
      }

      console.log('Submitting duty report:', submitData)

      await dispatch(createDutyReport(submitData)).unwrap()

      await SweetAlertService.success('Success!', 'Duty report submitted successfully')
      router.push('/duty-reports')

    } catch (error) {
      console.error('Submit error:', error)
      SweetAlertService.error('Error', typeof error === 'string' ? error : 'Failed to submit duty report')
    } finally {
      setIsLoading(false)
    }
  }

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
              <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Add Duty Report</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Submit your duty status report</p>
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
                      <Label htmlFor="guard_assignment_id" className="text-sm font-medium text-gray-700">
                        Assignment *
                      </Label>
                      <Select
                        value={formData.guard_assignment_id}
                        onValueChange={handleAssignmentChange}
                        disabled={isAssignmentsLoading}
                      >
                        <SelectTrigger className={`mt-1 ${errors.guard_assignment_id ? 'border-red-500' : ''}`}>
                          <SelectValue placeholder="Select an assignment" />
                        </SelectTrigger>
                        <SelectContent>
                          {assignmentOptions.map((assignment) => (
                            <SelectItem key={assignment.id} value={assignment.id.toString()}>
                              {assignment.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.guard_assignment_id && <p className="mt-1 text-sm text-red-500">{errors.guard_assignment_id}</p>}
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
                            <span className="text-gray-500">Duty:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.duty_title}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Site:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.site_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.site_location}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Report Details Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <MessageSquare className="h-5 w-5 text-[#5F0015]" />
                    <h2 className="text-lg font-semibold text-gray-900">Report Details</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    {/* Status OK Toggle */}
                    <div className="flex items-center justify-between rounded-lg border p-4 border-gray-200">
                      <div className="flex items-center gap-3">
                        {formData.is_ok ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {formData.is_ok ? 'All OK' : 'Issue Reported'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formData.is_ok ? 'Everything is running smoothly' : 'There is an issue to report'}
                          </p>
                        </div>
                      </div>
                      <Switch
                      color="red"
                        checked={formData.is_ok}
                        onCheckedChange={(checked) => handleInputChange('is_ok', checked)}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                        Message *
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Enter your status report message..."
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        className={`mt-1 min-h-[100px] ${errors.message ? 'border-red-500' : ''}`}
                      />
                      {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                    </div>

                    {/* Location Coordinates with Auto-fetch */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">Location Coordinates</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={getCurrentLocation}
                          disabled={isGettingLocation}
                          className="gap-2"
                        >
                          {isGettingLocation ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Getting Location...
                            </>
                          ) : (
                            <>
                              <Navigation className="h-4 w-4" />
                              Get Current Location
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="latitude" className="text-xs text-gray-500">
                            Latitude
                          </Label>
                          <Input
                            id="latitude"
                            placeholder="0.0000"
                            value={formData.latitude}
                            onChange={(e) => handleInputChange('latitude', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="longitude" className="text-xs text-gray-500">
                            Longitude
                          </Label>
                          <Input
                            id="longitude"
                            placeholder="0.0000"
                            value={formData.longitude}
                            onChange={(e) => handleInputChange('longitude', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      
                      {formData.latitude && formData.longitude && (
                        <div className="flex items-center gap-2 text-xs text-green-600">
                          <MapPin className="h-3 w-3" />
                          <span>Location captured: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}</span>
                        </div>
                      )}
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
                              <Upload className="h-5 w-5 text-[#5F0015]" />
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