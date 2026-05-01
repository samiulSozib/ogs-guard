// components/profile/change-password-modal.tsx
'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Key, Eye, EyeOff, X } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"

interface ChangePasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => Promise<void>
  isChanging: boolean
}

export function ChangePasswordModal({ isOpen, onClose, onSubmit, isChanging }: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [errors, setErrors] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const validateForm = () => {
    const newErrors = {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    }
    let isValid = true

    if (!formData.current_password) {
      newErrors.current_password = 'Current password is required'
      isValid = false
    }

    if (!formData.new_password) {
      newErrors.new_password = 'New password is required'
      isValid = false
    } else if (formData.new_password.length < 8) {
      newErrors.new_password = 'Password must be at least 8 characters'
      isValid = false
    }

    if (formData.new_password !== formData.new_password_confirmation) {
      newErrors.new_password_confirmation = 'Passwords do not match'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    await onSubmit(formData)
    if (!isChanging) {
      setFormData({
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-2xl p-0">
        <SheetHeader className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle>Change Password</SheetTitle>
              <SheetDescription>Update your security credentials</SheetDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <div className="p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  name="current_password"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.current_password}
                  onChange={handleChange}
                  placeholder="Enter current password"
                  className={`h-10 pr-10 ${errors.current_password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.current_password && (
                <p className="text-xs text-red-500">{errors.current_password}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  name="new_password"
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.new_password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  className={`h-10 pr-10 ${errors.new_password ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.new_password && (
                <p className="text-xs text-red-500">{errors.new_password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="new_password_confirmation"
                  name="new_password_confirmation"
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.new_password_confirmation}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  className={`h-10 pr-10 ${errors.new_password_confirmation ? "border-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.new_password_confirmation && (
                <p className="text-xs text-red-500">{errors.new_password_confirmation}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
              <p className="text-xs font-medium text-gray-700">Password requirements:</p>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${formData.new_password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.new_password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                  At least one number
                </li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-10"
                disabled={isChanging}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#5F0015] hover:bg-[#5F0015]/90 h-10"
                disabled={isChanging}
              >
                {isChanging ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
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
