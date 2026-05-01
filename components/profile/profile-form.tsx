// components/profile/profile-form-modal.tsx
'use client'

import { useState, useEffect } from "react"
import { Guard } from "@/app/types/profile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, X, Save } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface ProfileFormModalProps {
  isOpen: boolean
  onClose: () => void
  guard: Guard | null
  user: { id: number; name: string | null; email: string; created_at: string } | null
  onSubmit: (data: FormData) => Promise<void>
  isUpdating: boolean
}

export function ProfileFormModal({
  isOpen,
  onClose,
  guard,
  user,
  onSubmit,
  isUpdating
}: ProfileFormModalProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zip_code: '',
  })

  useEffect(() => {
    if (guard) {
      setFormData({
        full_name: guard.full_name || '',
        phone: guard.phone || '',
        email: guard.email || '',
        date_of_birth: guard.date_of_birth || '',
        gender: guard.gender || '',
        country: guard.country || '',
        state: guard.profile?.current_state || '',
        city: guard.city || '',
        address: guard.address || '',
        zip_code: guard.zip_code || '',
      })
    }
  }, [guard])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formDataToSend = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        formDataToSend.append(key, value)
      }
    })
    await onSubmit(formDataToSend)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-2xl p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Edit Profile</SheetTitle>
              <SheetDescription>Update your personal information</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(90vh-73px)] p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="full_name" className="text-sm font-medium">Full Name</Label>
                <Input
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="h-10"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="h-10"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className="h-10"
                  required
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5">
                <Label htmlFor="date_of_birth" className="text-sm font-medium">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleSelectChange('gender', value)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state" className="text-sm font-medium">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="city" className="text-sm font-medium">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zip_code" className="text-sm font-medium">Zip Code</Label>
                  <Input
                    id="zip_code"
                    name="zip_code"
                    value={formData.zip_code}
                    onChange={handleChange}
                    placeholder="Zip code"
                    className="h-10"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                  className="h-10"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#5F0015] hover:bg-[#5F0015]/90 h-10"
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
