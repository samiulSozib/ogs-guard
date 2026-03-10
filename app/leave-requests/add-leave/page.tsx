// app/leave-request/add/page.tsx
'use client'

import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { fetchSites } from "@/store/slices/siteSlice"
import { CreateLeaveDto } from "@/app/types/leave"

interface SiteOption {
  id: number;
  name: string;
  address?: string;
}

export default function AddLeaveRequestPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  
  // Get user/guard info from auth state
  const { user } = useAppSelector((state) => state.auth)
  const { isLoading } = useAppSelector((state) => state.leave)
  const { sites: siteList, isLoading: isSiteLoading } = useAppSelector((state) => state.site)
  
  const [formData, setFormData] = useState({
    title: "",
    site_id: "",
    start_date: "",
    end_date: "",
    leave_type: "",
    reason: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Fetch sites from API
  useEffect(() => {
    dispatch(fetchSites({ per_page: 100 }))
  }, [dispatch])

  // Handle input changes with proper typing
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  // Handle select changes
  const handleSelectChange = (field: string) => (e: ChangeEvent<HTMLSelectElement>) => {
    handleInputChange(field, e.target.value)
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Title validation (optional but if provided, should have minimum length)
    if (formData.title && formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters if provided"
    }
    
    // Site is now optional, only validate if provided
    if (formData.site_id && isNaN(parseInt(formData.site_id))) {
      newErrors.site_id = "Please select a valid site"
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

    // Validate date range
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

 // Update the handleSubmit function with proper typing
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
    // Create payload with proper CreateLeaveDto type
    const payload: CreateLeaveDto = {
      title: formData.title?.trim() || "Leave Request", // Provide a default title or make it required
      start_date: formData.start_date,
      end_date: formData.end_date,
      leave_type: formData.leave_type,
      reason: formData.reason.trim()
    }

    // Add site_id only if selected (as it's optional)
    if (formData.site_id) {
      payload.site_id = parseInt(formData.site_id)
    }

    // Note: guard_id might need to be added here if your API expects it
    // If guard_id is required by the API but not in CreateLeaveDto, you might need to:
    // 1. Add it to CreateLeaveDto in your types file, or
    // 2. Handle it differently in your leave service

    const result = await dispatch(createLeave(payload)).unwrap()

    await SweetAlertService.success(
      'Success!',
      'Leave request submitted successfully'
    )
    
    // Redirect to leave requests list
    router.push('/leave-requests')
    
  } catch (error) {
    SweetAlertService.error(
      'Error',
       'Failed to submit leave request'
    )
  }
}

  // Calculate total days
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

  // Get today's date in YYYY-MM-DD format for min attribute
  const getTodayString = (): string => {
    return new Date().toISOString().split('T')[0]
  }

  // Format sites for select options
  const siteOptions: SiteOption[] = siteList.map(site => ({
    id: site.id,
    name: site.site_name || `Site ${site.id}`,
    address: site.address
  }))

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      <AppSidebar
        variant="inset"
        collapsible="icon"
        className="hidden lg:flex"
      />

      <SidebarInset>
        <SiteHeader />

        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          
          {/* Header with back button */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Request Leave</h1>
              <p className="text-sm text-gray-500">Submit a new leave request</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 border rounded-xl bg-white p-6 shadow-sm">
            
            {/* Title Field - New Section */}
            <div className="max-w-md">
              <FloatingLabelInput
                id="title"
                label="Title (Optional)"
                placeholder="Enter a title for your leave request"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.title ? 'border-red-500' : ''
                }`}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Brief title to identify your leave request
              </p>
            </div>

            {/* Site Selection - Now Optional */}
            <div className="max-w-md">
              <FloatingLabelSelect
                label="Site (Optional)"
                value={formData.site_id}
                onChange={handleSelectChange('site_id')}
                className={`border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.site_id ? 'border-red-500' : ''
                }`}
                disabled={isSiteLoading}
              >
                <option value="">Select a site (optional)</option>
                {siteOptions.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </FloatingLabelSelect>
              {errors.site_id && (
                <p className="mt-1 text-sm text-red-500">{errors.site_id}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Select a site if this leave is site-specific
              </p>
            </div>

            {/* Leave Type */}
            <div className="max-w-md">
              <FloatingLabelSelect
                label="Leave Type *"
                value={formData.leave_type}
                onChange={handleSelectChange('leave_type')}
                className={`border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.leave_type ? 'border-red-500' : ''
                }`}
              >
                <option value="" disabled>Select leave type</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="annual">Annual Leave</option>
                <option value="emergency">Emergency Leave</option>
              </FloatingLabelSelect>
              {errors.leave_type && (
                <p className="mt-1 text-sm text-red-500">{errors.leave_type}</p>
              )}
            </div>

            {/* Start Date */}
            <div className="max-w-md">
              <FloatingLabelInput
                id="start_date"
                label="Start Date *"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleInputChange('start_date', e.target.value)}
                className={`border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.start_date ? 'border-red-500' : ''
                }`}
                min={getTodayString()}
              />
              {errors.start_date && (
                <p className="mt-1 text-sm text-red-500">{errors.start_date}</p>
              )}
            </div>

            {/* End Date */}
            <div className="max-w-md">
              <FloatingLabelInput
                id="end_date"
                label="End Date *"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleInputChange('end_date', e.target.value)}
                className={`border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.end_date ? 'border-red-500' : ''
                }`}
                min={formData.start_date || getTodayString()}
              />
              {errors.end_date && (
                <p className="mt-1 text-sm text-red-500">{errors.end_date}</p>
              )}
            </div>

            {/* Total Days Display */}
            {formData.start_date && formData.end_date && !errors.end_date && !errors.start_date && (
              <div className="max-w-md">
                <div className="rounded-md bg-gray-50 p-3 border border-gray-200">
                  <p className="text-sm text-gray-600">
                    Total Days: <span className="font-semibold text-[#5F0015]">{calculateTotalDays()}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Including start and end date
                  </p>
                </div>
              </div>
            )}

            {/* Reason */}
            <div className="max-w-2xl">
              <FloatingLabelTextarea
                id="reason"
                label="Reason for Leave *"
                placeholder="Please provide detailed reason for your leave request"
                value={formData.reason}
                onChange={(e) => handleInputChange('reason', e.target.value)}
                className={`min-h-[120px] border-gray-300 focus:border-[#5F0015] focus:ring-[#5F0015] ${
                  errors.reason ? 'border-red-500' : ''
                }`}
                rows={4}
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-500">{errors.reason}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Minimum 10 characters
              </p>
            </div>

            <hr className="border-gray-200" />

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="flex-1 py-3"
                size="lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#5F0015] text-white hover:bg-[#5F0015]/90 py-3"
                size="lg"
                disabled={isLoading || isSiteLoading}
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
            <p className="text-xs text-gray-400 text-right">
              * Required fields | Other fields are optional
            </p>
          </form>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}