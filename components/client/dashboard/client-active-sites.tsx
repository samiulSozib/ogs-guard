// components/client/client-active-sites.tsx
'use client';

import { SiteSummary } from "@/app/types/client/dashboard"
import { MapPin, Shield, ChevronRight, Building } from "lucide-react"
import Link from "next/link"

interface ClientActiveSitesProps {
  sites: SiteSummary[]
}

export function ClientActiveSites({ sites }: ClientActiveSitesProps) {
  if (sites.length === 0) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm dark:bg-gray-800">
        <Building className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">No sites added yet</p>
        <Link href="/client/sites/create">
          <button className="mt-3 text-sm text-blue-600 hover:text-blue-700">
            Add your first site →
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {sites.map((site) => (
        <div key={site.id} className="rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Site Name: {site.site_name}</h3>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{site.address}</p>
              <div className="mt-3 flex flex-wrap gap-4">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-gray-400" />
                  <span className="text-xs text-gray-600 dark:text-gray-300">
                    Number of guards: {site.active_guards_count}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`h-2 w-2 rounded-full ${
                    site.status === 'active' ? 'bg-green-500' :
                    site.status === 'planned' ? 'bg-blue-500' :
                    site.status === 'inactive' ? 'bg-gray-500' : 'bg-yellow-500'
                  }`} />
                  <span className={`text-xs font-medium capitalize ${
                    site.status === 'active' ? 'text-green-600' :
                    site.status === 'planned' ? 'text-blue-600' :
                    'text-gray-500'
                  }`}>
                    Status: {site.status}
                  </span>
                </div>
              </div>
            </div>
            <Link href={`/client/sites/${site.id}`}>
              <button className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-blue-600 dark:hover:bg-gray-700">
                <ChevronRight className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}