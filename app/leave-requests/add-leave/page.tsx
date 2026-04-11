// app/leave-requests/add-leave/page.tsx
'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Calendar, FileText, AlertCircle, Clock, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { FloatingLabelInput } from "@/components/ui/floating-input"
import { FloatingLabelSelect } from "@/components/ui/floating-select"
import { FloatingLabelTextarea } from "@/components/ui/floating-textarea"
import { createLeave } from "@/store/slices/leaveSlice"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import SweetAlertService from "@/lib/sweetAlert"
import { fetchAssignments } from "@/store/slices/guardAssignmentSlice"
import { CreateLeaveDto } from "@/app/types/leave"
import { HeaderCard } from "@/components/leave-request/header-card"

interface AssignmentOption {
  id: number;
  label: string;
  site_id: number;
  site_name: string;
  client_name: string;
  duty_title: string;
}

export default function AddLeaveRequestPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading } = useAppSelector((state) => state.leave)
  const { assignments, isLoading: isAssignmentsLoading } = useAppSelector((state) => state.guardAssignment)
  
  const [formData, setFormData] = useState({
    title: "",
    assignment_id: "",
    start_date: "",
    end_date: "",
    leave_type: "",
    reason: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentOption | null>(null)

  // Get guard info from localStorage
  const getGuardInfo = () => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        return user.id
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error)
    }
    return null
  }

  // Fetch guard assignments on mount - no setState here, only dispatch
  useEffect(() => {
    const guardId = getGuardInfo()
    if (guardId) {
      dispatch(fetchAssignments({ 
        guard_id: guardId,
        per_page: 100,
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
      label: `${assignment.duty?.title || 'Duty'} - ${assignment.duty?.site?.site_name || 'Site'} ${assignment.duty?.start_datetime ? `(${new Date(assignment.duty.start_datetime).toLocaleDateString()})` : ''}`,
      site_id: assignment.duty?.site_id || 0,
      site_name: assignment.duty?.site?.site_name || 'Unknown Site',
      client_name: assignment.duty?.site?.client?.full_name || assignment.duty?.site?.client?.company_name || 'Unknown Client',
      duty_title: assignment.duty?.title || 'Unknown Duty'
    }))

  const handleAssignmentChange = (assignmentId: string) => {
    const assignment = assignmentOptions.find(opt => opt.id.toString() === assignmentId)
    if (assignment) {
      setSelectedAssignment(assignment)
      setFormData(prev => ({
        ...prev,
        assignment_id: assignmentId
      }))
    } else {
      setSelectedAssignment(null)
      setFormData(prev => ({
        ...prev,
        assignment_id: ""
      }))
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (formData.title && formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters if provided"
    }
    
    if (!formData.start_date) {
      newErrors.start_date = "Start date is required"
    } else {
      const selectedDate = new Date(formData.start_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.start_date = "Start date cannot be in the past"
      }
    }
    
    if (!formData.end_date) {
      newErrors.end_date = "End date is required"
    } else {
      const selectedDate = new Date(formData.end_date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (selectedDate < today) {
        newErrors.end_date = "End date cannot be in the past"
      }
    }
    
    if (!formData.leave_type) {
      newErrors.leave_type = "Please select leave type"
    }
    
    if (!formData.reason.trim()) {
      newErrors.reason = "Reason is required"
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = "Please provide a detailed reason (minimum 10 characters)"
    }

    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date)
      const end = new Date(formData.end_date)
      
      if (end < start) {
        newErrors.end_date = "End date cannot be before start date"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) {
      SweetAlertService.error('Error', 'User not authenticated')
      return
    }

    if (!validateForm()) {
      SweetAlertService.warning('Validation Error', 'Please fill all required fields correctly')
      return
    }

    try {
      const payload: CreateLeaveDto = {
        title: formData.title?.trim() || "Leave Request",
        start_date: formData.start_date,
        end_date: formData.end_date,
        leave_type: formData.leave_type,
        reason: formData.reason.trim()
      }

      // Add site_id only if an assignment is selected (optional)
      if (selectedAssignment && selectedAssignment.site_id) {
        payload.site_id = selectedAssignment.site_id
      }

      await dispatch(createLeave(payload)).unwrap()

      await SweetAlertService.success('Success!', 'Leave request submitted successfully')
      router.push('/leave-requests')
      
    } catch (error) {
      SweetAlertService.error('Error', 'Failed to submit leave request')
    }
  }

  const calculateTotalDays = (): number => {
    if (formData.start_date && formData.end_date) {
      const start = new Date(formData.start_date)
      const end = new Date(formData.end_date)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    }
    return 0
  }

  const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0]
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
      <AppSidebar variant="inset" collapsible="icon" className="hidden lg:flex" />
      <SidebarInset>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 pb-24 sm:px-6 lg:px-8 lg:pb-6">
          
          <HeaderCard/>

          {/* Form Card */}
          <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Basic Information Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <FileText className="h-5 w-5 text-[#5F0015]" />
                    <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {/* Title Field */}
                    <div className="lg:col-span-2">
                      <FloatingLabelInput
                        id="title"
                        label="Title (Optional)"
                        placeholder="e.g., Family Event, Medical Appointment"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${
                          errors.title ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        A brief title to identify your leave request
                      </p>
                    </div>

                    {/* Assignment Selection (Optional) */}
                    <div className="lg:col-span-2">
                      <FloatingLabelSelect
                        label="Select Assignment (Optional)"
                        value={formData.assignment_id}
                        onChange={(e) => handleAssignmentChange(e.target.value)}
                        className="border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white"
                        disabled={isAssignmentsLoading}
                      >
                        <option value="">Select an assignment (optional)</option>
                        {assignmentOptions.map((assignment) => (
                          <option key={assignment.id} value={assignment.id}>
                            {assignment.label}
                          </option>
                        ))}
                      </FloatingLabelSelect>
                      {isAssignmentsLoading && (
                        <div className="mt-2 text-sm text-gray-500 flex items-center gap-2">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-[#5F0015] border-t-transparent" />
                          <span>Loading your assignments...</span>
                        </div>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Select an assignment to associate this leave with a specific site (optional)
                      </p>
                    </div>

                    {/* Selected Assignment Details */}
                    {selectedAssignment && (
                      <div className="lg:col-span-2 rounded-lg bg-gray-50 p-4 border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#5F0015]" />
                          Assignment Details:
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Client:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.client_name}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Site:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.site_name}</p>
                          </div>
                          <div className="sm:col-span-2">
                            <span className="text-gray-500">Duty:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.duty_title}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Site ID:</span>
                            <p className="font-medium text-gray-900">{selectedAssignment.site_id}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Leave Type */}
                    <div>
                      <FloatingLabelSelect
                        label="Leave Type *"
                        value={formData.leave_type}
                        onChange={(e) => handleInputChange('leave_type', e.target.value)}
                        className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${
                          errors.leave_type ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="" disabled>Select leave type</option>
                        <option value="sick">🤒 Sick Leave</option>
                        <option value="casual">🏖️ Casual Leave</option>
                        <option value="annual">🌴 Annual Leave</option>
                        <option value="emergency">🚨 Emergency Leave</option>
                      </FloatingLabelSelect>
                      {errors.leave_type && (
                        <p className="mt-1 text-sm text-red-500">{errors.leave_type}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date Information Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <Calendar className="h-5 w-5 text-[#5F0015]" />
                    <h2 className="text-lg font-semibold text-gray-900">Date Information</h2>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {/* Start Date */}
                    <div>
                      <FloatingLabelInput
                        id="start_date"
                        label="Start Date *"
                        type="date"
                        value={formData.start_date}
                        onChange={(e) => handleInputChange('start_date', e.target.value)}
                        className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${
                          errors.start_date ? 'border-red-500' : ''
                        }`}
                        min={getTodayString()}
                      />
                      {errors.start_date && (
                        <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
                      )}
                    </div>

                    {/* End Date */}
                    <div>
                      <FloatingLabelInput
                        id="end_date"
                        label="End Date *"
                        type="date"
                        value={formData.end_date}
                        onChange={(e) => handleInputChange('end_date', e.target.value)}
                        className={`border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${
                          errors.end_date ? 'border-red-500' : ''
                        }`}
                        min={formData.start_date || getTodayString()}
                      />
                      {errors.end_date && (
                        <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
                      )}
                    </div>
                  </div>

                  {/* Total Days Display */}
                  {formData.start_date && formData.end_date && !errors.end_date && !errors.start_date && (
                    <div className="rounded-xl bg-gradient-to-r from-[#5F0015]/5 to-transparent p-4 border border-[#5F0015]/10">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Total Leave Duration</p>
                          <p className="text-2xl font-bold text-[#5F0015]">{calculateTotalDays()} days</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(formData.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} 
                            {' - '}
                            {new Date(formData.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">Including start and end date</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reason Section */}
                <div className="space-y-5">
                  <div className="flex items-center gap-2 pb-2 border-b">
                    <AlertCircle className="h-5 w-5 text-[#5F0015]" />
                    <h2 className="text-lg font-semibold text-gray-900">Leave Details</h2>
                  </div>

                  <div>
                    <FloatingLabelTextarea
                      id="reason"
                      label="Reason for Leave *"
                      placeholder="Please provide a detailed reason for your leave request..."
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      className={`min-h-[130px] border-gray-200 focus:border-[#5F0015] focus:ring-[#5F0015] bg-white ${
                        errors.reason ? 'border-red-500' : ''
                      }`}
                      rows={4}
                    />
                    {errors.reason && (
                      <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Minimum 10 characters - Be specific about your reason
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <hr className="border-gray-200" />
                  
                  <div className="flex flex-col-reverse gap-3 sm:flex-row sm:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="w-full border-gray-300 sm:w-auto sm:min-w-[120px]"
                      size="lg"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="w-full bg-[#5F0015] text-white hover:bg-[#5F0015]/90 sm:w-auto sm:min-w-[180px]"
                      size="lg"
                      disabled={isLoading || isAssignmentsLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Leave Request'
                      )}
                    </Button>
                  </div>

                  {/* Required fields note */}
                  <p className="text-xs text-gray-400 text-center">
                    <span className="text-red-500">*</span> Required fields | Assignment is optional
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}