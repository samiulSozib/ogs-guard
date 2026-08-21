// components/client/client-profile-form.tsx
'use client'

import { useState, useEffect } from "react"
import { Client } from "@/app/types/client/client.types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Save, UploadCloud, Building, Phone, Mail, MapPin, Globe, User, Briefcase } from "lucide-react"
import Image from "next/image"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import SweetAlertService from "@/lib/sweetAlert"

interface ClientProfileFormProps {
  isOpen: boolean
  onClose: () => void
  client: Client | null
  user: { id: number; email: string; created_at: string } | null
  onSubmit: (data: FormData) => Promise<void>
  isUpdating: boolean
}

const BUSINESS_TYPES = [
  { value: "retail", label: "Retail" },
  { value: "corporate", label: "Corporate" },
  { value: "industrial", label: "Industrial" },
  { value: "residential", label: "Residential" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "hospitality", label: "Hospitality" },
  { value: "other", label: "Other" },
]

const INDUSTRIES = [
  { value: "security", label: "Security" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "retail", label: "Retail" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
]

export function ClientProfileForm({
  isOpen,
  onClose,
  client,
  user,
  onSubmit,
  isUpdating
}: ClientProfileFormProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    company_name: '',
    country: '',
    city: '',
    address: '',
    zip_code: '',
    website: '',
    business_type: '',
    industry: '',
    contact_person: '',
    contact_person_phone: '',
  })

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [existingProfileImage, setExistingProfileImage] = useState("")

  useEffect(() => {
    if (client) {
      setFormData({
        full_name: client.full_name || '',
        phone: client.phone || '',
        email: client.email || '',
        company_name: client.company_name || '',
        country: client.country || '',
        city: client.city || '',
        address: client.address || '',
        zip_code: client.zip_code || '',
        website: client.website || '',
        business_type: client.business_type || '',
        industry: client.industry || '',
        contact_person: client.contact_person || '',
        contact_person_phone: client.contact_person_phone || '',
      })

      if (client.profile_image_url) {
        setExistingProfileImage(client.profile_image_url)
      }
    }
  }, [client])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        SweetAlertService.error("Invalid file type", "Please upload an image file")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        SweetAlertService.error("File too large", "Please upload an image smaller than 5MB")
        return
      }
      setProfileImage(file)
      setExistingProfileImage("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formDataToSend = new FormData()
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value)
      }
    })

    if (profileImage) {
      formDataToSend.append('profile_image', profileImage)
    } else if (existingProfileImage && !profileImage) {
      formDataToSend.append('keep_profile_image', '1')
    } else if (!existingProfileImage && !profileImage) {
      formDataToSend.append('remove_profile_image', '1')
    }

    await onSubmit(formDataToSend)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0 dark:bg-gray-900">
        <SheetHeader className="p-4 border-b sticky top-0 bg-white dark:bg-gray-900 z-10 border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="dark:text-white">Edit Client Profile</SheetTitle>
              <SheetDescription className="dark:text-gray-400">Update your company and personal information</SheetDescription>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="shrink-0 dark:hover:bg-gray-800 dark:text-gray-400"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(90vh-73px)] p-4 dark:bg-gray-900">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="border rounded-xl p-4 border-gray-200 dark:border-gray-800">
              <Label className="text-sm font-medium mb-3 block dark:text-gray-300">Company Logo / Profile Photo</Label>
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <input
                    type="file"
                    id="profileImage"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <label htmlFor="profileImage" className="cursor-pointer">
                    <div className="relative w-32 h-32 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all overflow-hidden">
                      {(profileImage || existingProfileImage) ? (
                        <>
                          <Image
                            src={profileImage ? URL.createObjectURL(profileImage) : existingProfileImage}
                            alt="Profile preview"
                            width={128}
                            height={128}
                            className="rounded-full object-cover w-full h-full"
                            unoptimized={!!existingProfileImage}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <UploadCloud className="w-8 h-8 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <Building className="w-8 h-8 text-gray-400 dark:text-gray-500 mb-2" />
                          <p className="text-sm text-gray-600 dark:text-gray-400 text-center px-2">
                            Upload Logo
                          </p>
                        </>
                      )}
                    </div>
                  </label>
                </div>
                {(profileImage || existingProfileImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      setProfileImage(null);
                      setExistingProfileImage("");
                    }}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm flex items-center gap-1"
                  >
                    <X size={14} /> Remove Logo
                  </button>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                  JPG, PNG, GIF. Max 5MB. Square image recommended.
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </h3>
              
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-sm font-medium dark:text-gray-300">Full Name *</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-sm font-medium dark:text-gray-300">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-sm font-medium dark:text-gray-300">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white flex items-center gap-2">
                <Building className="h-5 w-5" />
                Company Information
              </h3>

              <div className="space-y-1.5">
                <Label htmlFor="company_name" className="text-sm font-medium dark:text-gray-300">Company Name</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Company name"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="business_type" className="text-sm font-medium dark:text-gray-300">Business Type</Label>
                  <Select
                    value={formData.business_type}
                    onValueChange={(value) => handleSelectChange('business_type', value)}
                  >
                    <SelectTrigger className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {BUSINESS_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="dark:text-white dark:focus:bg-gray-700">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="industry" className="text-sm font-medium dark:text-gray-300">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleSelectChange('industry', value)}
                  >
                    <SelectTrigger className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                      {INDUSTRIES.map((industry) => (
                        <SelectItem key={industry.value} value={industry.value} className="dark:text-white dark:focus:bg-gray-700">
                          {industry.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="website" className="text-sm font-medium dark:text-gray-300">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="pl-10 h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Contact Person
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="contact_person" className="text-sm font-medium dark:text-gray-300">Contact Person Name</Label>
                  <Input
                    id="contact_person"
                    name="contact_person"
                    value={formData.contact_person}
                    onChange={handleChange}
                    placeholder="Contact person name"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contact_person_phone" className="text-sm font-medium dark:text-gray-300">Contact Person Phone</Label>
                  <Input
                    id="contact_person_phone"
                    name="contact_person_phone"
                    value={formData.contact_person_phone}
                    onChange={handleChange}
                    placeholder="Contact person phone"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg dark:text-white flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address Information
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium dark:text-gray-300">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm font-medium dark:text-gray-300">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium dark:text-gray-300">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street address"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="zip_code" className="text-sm font-medium dark:text-gray-300">Zip Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  placeholder="Zip code"
                  className="h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder:text-gray-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4 sticky bottom-0 bg-white dark:bg-gray-900 pb-4 border-t border-gray-200 dark:border-gray-800 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 h-10 dark:bg-blue-500 dark:hover:bg-blue-600"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  )
}