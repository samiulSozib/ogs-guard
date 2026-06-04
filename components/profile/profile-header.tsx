// components/profile/profile-header.tsx
'use client'

import { Guard } from "@/app/types/profile"
import { Shield, Calendar, Phone, Mail, MapPin, Star } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProfileHeaderProps {
  guard: Guard | null
}

export function ProfileHeader({ guard }: ProfileHeaderProps) {
  const [imageError, setImageError] = useState(false)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden shadow-sm">
      {/* Cover Image */}
      <div className="h-20 bg-gradient-to-r from-[#5F0015] to-[#8B0020]" />

      <div className="px-4 pb-4">
        {/* Avatar Section */}
        <div className="flex justify-center -mt-10 mb-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                {guard?.profile_image_url && !imageError ? (
                  <Image
                    src={guard.profile_image_url}
                    alt={guard.full_name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                    {guard?.full_name ? getInitials(guard.full_name) : "G"}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-[#5F0015] dark:bg-[#8B001F] rounded-full p-1.5 border-2 border-white dark:border-gray-800">
              <Shield className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Name & Status */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{guard?.full_name}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              guard?.is_active
                ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${guard?.is_active ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`} />
              {guard?.is_active ? 'Active' : 'Inactive'}
            </span>
            {/* {guard?.rating && parseFloat(guard.rating) > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                {guard.rating}
              </span>
            )} */}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Phone className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span>{guard?.phone || 'No phone'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{guard?.email || 'No email'}</span>
          </div>
          {guard?.city && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span>{guard.city}{guard?.country ? `, ${guard.country}` : ''}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span>Joined {guard?.joining_date ? new Date(guard.joining_date).toLocaleDateString() : '-'}</span>
          </div>
        </div>

        {/* Guard Code Badge */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Guard Code</p>
            <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white text-center">
              {guard?.guard_code || '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}