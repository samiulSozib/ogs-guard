// app/client/profile/page.tsx
'use client'

import { useEffect, useRef, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { 
  fetchCurrentClient, 
  updateClientProfile, 
  clientChangePassword, 
  clearClientError, 
  clearClientSuccess, 
  clientForgotPassword 
} from "@/store/slices/client/clientProfileSlice"  // Fixed import path
import { User, Key, ChevronRight, Mail, Building, MapPin, Globe, Briefcase, Phone } from "lucide-react"
import SweetAlertService from "@/lib/sweetAlert"
import { ClientHeader } from "@/components/client/client-header"
import { ClientProfileForm } from "@/components/client/client-profile-form"
import { ClientChangePasswordModal } from "@/components/client/client-change-password-modal"
import ClientGuardedRoute from "@/components/clientGuardedRoute"

function ClientProfileContent() {
  const dispatch = useAppDispatch()
  const { client, user, isLoading, isUpdating, isChangingPassword, error, successMessage } = useAppSelector(
    (state) => state.clientProfile  // Fixed state path - was state.clientProfile
  )

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
    const hasFetched = useRef(false) // Add this to prevent multiple fetches


 useEffect(() => {
    if (!client && !hasFetched.current) {
      hasFetched.current = true
      dispatch(fetchCurrentClient())
    }
  }, [dispatch, client])

  useEffect(() => {
    if (successMessage) {
      SweetAlertService.success('Success', successMessage)
      dispatch(clearClientSuccess())
    }
    if (error) {
      SweetAlertService.error('Error', error)
      dispatch(clearClientError())
    }
  }, [successMessage, error, dispatch])

  const handleUpdateProfile = async (data: FormData) => {
    const result = await dispatch(updateClientProfile(data))
    if (updateClientProfile.fulfilled.match(result)) {
      setShowProfileModal(false)
      await SweetAlertService.success('Success', 'Profile updated successfully', {
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const handleChangePassword = async (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => {
    const result = await dispatch(clientChangePassword(data))
    if (clientChangePassword.fulfilled.match(result)) {
      setShowPasswordModal(false)
      await SweetAlertService.success('Success', 'Password changed successfully', {
        timer: 2000,
        showConfirmButton: false
      })
    }
  }

  const menuItems = [
    {
      id: 'profile',
      title: 'Company Profile',
      description: 'Update your company and personal details',
      icon: Building,
      onClick: () => setShowProfileModal(true),
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      id: 'security',
      title: 'Security',
      description: 'Change your password',
      icon: Key,
      onClick: () => setShowPasswordModal(true),
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      id: 'forgot-password',
      title: 'Reset Password',
      description: 'Send password reset link to email',
      icon: Mail,
      onClick: () => {
        SweetAlertService.confirm(
          'Reset Password',
          'A password reset link will be sent to your email address. Do you want to continue?',
          'Yes, send link',
          'Cancel'
        ).then(async (result) => {
          if (result.isConfirmed && client?.email) {
            const res = await dispatch(clientForgotPassword({ email: client.email }));
            if (clientForgotPassword.fulfilled.match(res)) {
              await SweetAlertService.success(
                'Reset Link Sent',
                `A password reset link has been sent to ${client.email}`,
                { timer: 3000, showConfirmButton: false }
              );
            } else {
              await SweetAlertService.error(
                'Failed to Send',
                'Unable to send reset link. Please try again.'
              );
            }
          }
        });
      },
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30'
    },
  ];

  const statsItems = [
    { label: 'Client Code', value: client?.client_code || '-', icon: User },
    { label: 'Sites', value: client?.sites_count || 0, icon: MapPin },
    { label: 'Contracts', value: client?.contracts_count || 0, icon: Briefcase },
  ];

  if (isLoading) {
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
          <main className="flex-1 flex items-center justify-center dark:bg-gray-900">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 dark:border-blue-400 border-t-transparent" />
          </main>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
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

        <main className="flex-1 px-4 py-4 pb-20 md:px-6 lg:px-8 dark:bg-gray-900">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Profile Header */}
            <ClientHeader client={client} />

            {/* Stats Section */}
            <div className="grid grid-cols-3 gap-3">
              {statsItems.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-3 text-center shadow-sm border border-gray-100 dark:border-gray-700">
                  <item.icon className="h-4 w-4 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
              ))}
            </div>

            {/* Contact Info Quick View */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-2 shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Contact Information</h3>
              {client?.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{client.phone}</span>
                </div>
              )}
              {client?.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{client.email}</span>
                </div>
              )}
              {client?.website && (
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">{client.website}</span>
                </div>
              )}
              {(client?.city || client?.country) && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <span className="text-gray-600 dark:text-gray-300">
                    {[client?.city, client?.country].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 active:scale-[0.98] border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.bgColor}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </button>
              ))}
            </div>
          </div>
        </main>

        <BottomNav />
      </SidebarInset>

      {/* Modals */}
      <ClientProfileForm
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        client={client}
        user={user}
        onSubmit={handleUpdateProfile}
        isUpdating={isUpdating}
      />

      <ClientChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        isChanging={isChangingPassword}
      />
    </SidebarProvider>
  )
}

export default function ClientProfilePage() {
  return (
    <ClientGuardedRoute>
      <ClientProfileContent />
    </ClientGuardedRoute>
  )
}