// app/profile/page.tsx
'use client'

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { useAppSelector } from "@/hooks/useAppSelector"
import { fetchCurrentProfile, updateProfile, changePassword, clearProfileError, clearProfileSuccess, forgotPassword } from "@/store/slices/profileSlice"
import { User, Key, FileText, Settings, ChevronRight, Mail } from "lucide-react"
import SweetAlertService from "@/lib/sweetAlert"
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileFormModal } from '@/components/profile/profile-form'
import { ChangePasswordModal } from '@/components/profile/change-password-form'

export default function ProfilePage() {
  const dispatch = useAppDispatch()
  const { guard, user, isLoading, isUpdating, isChangingPassword, error, successMessage } = useAppSelector(
    (state) => state.profile
  )

  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    dispatch(fetchCurrentProfile())
  }, [dispatch])

  useEffect(() => {
    if (successMessage) {
      SweetAlertService.success('Success', successMessage)
      dispatch(clearProfileSuccess())
    }
    if (error) {
      SweetAlertService.error('Error', error)
      dispatch(clearProfileError())
    }
  }, [successMessage, error, dispatch])

  const handleUpdateProfile = async (data: FormData) => {
    const result = await dispatch(updateProfile(data))
    if (updateProfile.fulfilled.match(result)) {
      setShowProfileModal(false)
      SweetAlertService.success('Success', 'Profile updated successfully')
    }
  }

  const handleChangePassword = async (data: {
    current_password: string
    new_password: string
    new_password_confirmation: string
  }) => {
    const result = await dispatch(changePassword(data))
    if (changePassword.fulfilled.match(result)) {
      setShowPasswordModal(false)
      SweetAlertService.success('Success', 'Password changed successfully')
    }
  }

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
          <main className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#5F0015] border-t-transparent" />
          </main>
          <BottomNav />
        </SidebarInset>
      </SidebarProvider>
    )
  }

// app/profile/page.tsx (updated menu items)
// app/profile/page.tsx - Updated menuItems
const menuItems = [
  {
    id: 'profile',
    title: 'Personal Information',
    description: 'Update your personal details',
    icon: User,
    onClick: () => setShowProfileModal(true),
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Change your password',
    icon: Key,
    onClick: () => setShowPasswordModal(true),
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: 'forgot-password',
    title: 'Reset Password',
    description: 'Send password reset link to email',
    icon: Mail,
    onClick: () => {
      // Use the correct method signature: confirm(title, text, confirmButtonText, cancelButtonText)
      SweetAlertService.confirm(
        'Reset Password',
        'A password reset link will be sent to your email address. Do you want to continue?',
        'Yes, send link',
        'Cancel'
      ).then(async (result) => {
        if (result.isConfirmed && guard?.email) {
          const res = await dispatch(forgotPassword({ email: guard.email }));
          if (forgotPassword.fulfilled.match(res)) {
            SweetAlertService.success(
              'Reset Link Sent',
              `A password reset link has been sent to ${guard.email}`
            );
          } else {
            SweetAlertService.error(
              'Failed to Send',
              'Unable to send reset link. Please try again.'
            );
          }
        }
      });
    },
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  }
];

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

        <main className="flex-1 px-4 py-4 pb-20 md:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Profile Header */}
            <ProfileHeader guard={guard} />

            {/* Menu Items */}
            <div className="space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  className="w-full bg-white rounded-xl p-4 flex items-center justify-between hover:shadow-md transition-all duration-200 active:scale-[0.98] border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${item.bgColor}`}>
                      <item.icon className={`h-5 w-5 ${item.color}`} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{guard?.guard_code || '-'}</p>
                <p className="text-xs text-gray-500 mt-1">Guard ID</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{guard?.rating || '0.00'}</p>
                <p className="text-xs text-gray-500 mt-1">Rating</p>
              </div>
            </div>
          </div>
        </main>

        <BottomNav />
      </SidebarInset>

      {/* Modals */}
      <ProfileFormModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        guard={guard}
        user={user}
        onSubmit={handleUpdateProfile}
        isUpdating={isUpdating}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSubmit={handleChangePassword}
        isChanging={isChangingPassword}
      />
    </SidebarProvider>
  )
}
