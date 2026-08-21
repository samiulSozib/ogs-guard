// components/client/client-header.tsx
'use client'

import { Client } from "@/app/types/client/client.types"
import { Shield, Calendar, Phone, Mail, MapPin, Building, Star, Briefcase } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ClientHeaderProps {
  client: Client | null
}

export function ClientHeader({ client }: ClientHeaderProps) {
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
      <div className="h-20 bg-gradient-to-r from-blue-600 to-blue-800" />

      <div className="px-4 pb-4">
        {/* Avatar Section */}
        <div className="flex justify-center -mt-10 mb-3">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-white dark:bg-gray-800 p-0.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                {client?.profile_image && !imageError ? (
                  <Image
                    src={client.profile_image}
                    alt={client.full_name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-600 dark:text-gray-300">
                    {client?.full_name ? getInitials(client.full_name) : "C"}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-600 dark:bg-blue-500 rounded-full p-1.5 border-2 border-white dark:border-gray-800">
              <Building className="h-3 w-3 text-white" />
            </div>
          </div>
        </div>

        {/* Name & Status */}
        <div className="text-center mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{client?.full_name}</h2>
          {client?.company_name && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.company_name}</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
              client?.is_active
                ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
            }`}>
              <div className={`h-1.5 w-1.5 rounded-full ${client?.is_active ? 'bg-green-500 dark:bg-green-400' : 'bg-red-500 dark:bg-red-400'}`} />
              {client?.is_active ? 'Active' : 'Inactive'}
            </span>
            {client?.verification_status === 'verified' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400">
                <Star className="h-3 w-3 fill-green-500" />
                Verified
              </span>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 text-sm">
          {client?.phone && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Phone className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span>{client.phone}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Mail className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span className="truncate">{client?.email || 'No email'}</span>
          </div>
          {client?.city && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span>{client.city}{client?.country ? `, ${client.country}` : ''}</span>
            </div>
          )}
          {client?.business_type && (
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Briefcase className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
              <span className="capitalize">{client.business_type}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <Calendar className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500" />
            <span>Joined {client?.created_at ? new Date(client.created_at).toLocaleDateString() : '-'}</span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Sites</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {client?.sites_count || 0}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Contracts</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {client?.contracts_count || 0}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Client Code</p>
              <p className="text-xs font-mono font-semibold text-gray-900 dark:text-white truncate">
                {client?.client_code || '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}