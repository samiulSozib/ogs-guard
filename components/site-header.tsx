// // components/site-header.tsx
// "use client";

// import { Button } from "@/components/ui/button"
// import { Separator } from "@/components/ui/separator"
// import { SidebarTrigger } from "@/components/ui/sidebar"
// import { LogOut, User } from "lucide-react"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { useAppDispatch } from "@/hooks/useAppDispatch"
// import { logout } from "@/store/slices/authSlice"
// import { useRouter } from "next/navigation"
// import SweetAlertService from "@/lib/sweetAlert"
// import { useAppSelector } from "@/hooks/useAppSelector";

// export function SiteHeader() {
//   const dispatch = useAppDispatch()
//   const router = useRouter()
//   const { user } = useAppSelector((state) => state.auth)

//   const handleLogout = async () => {
//     const result = await SweetAlertService.confirm(
//       'Logout Confirmation',
//       'Are you sure you want to logout?',
//       'Yes, Logout',
//       'Cancel'
//     )

//     if (result.isConfirmed) {
//       // Dispatch logout (this will clear Redux state and show success message)
//       await dispatch(logout())

//       // Clear any additional localStorage items (like tracking data)
//       localStorage.removeItem('guard_tracking_active')
//       localStorage.removeItem('locationIntervalId')
//       localStorage.removeItem('heartbeatIntervalId')
//       localStorage.removeItem('device_id')

//       // Stop any running intervals if needed
//       const heartbeatIntervalId = localStorage.getItem('heartbeatIntervalId')
//       if (heartbeatIntervalId) {
//         clearInterval(parseInt(heartbeatIntervalId))
//       }

//       // Redirect to login page
//       router.push('/login')
//     }
//   }

//   // Get user initials for avatar fallback
//   const getUserInitials = () => {
//     if (!user) return "GU"
//     const firstName = user.first_name?.charAt(0) || ""
//     const lastName = user.last_name?.charAt(0) || ""
//     return `${firstName}${lastName}`.toUpperCase() || "GU"
//   }

//   // Get user display name
//   const getUserName = () => {
//     if (!user) return "Guest"
//     return `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email || "User"
//   }

//   return (
//     <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
//       <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
//         <SidebarTrigger className="-ml-1" />
//         <Separator
//           orientation="vertical"
//           className="mx-2 data-[orientation=vertical]:h-4"
//         />
//         <h1 className="text-base font-medium">Dashboard</h1>
//         <div className="ml-auto flex items-center gap-2">
//           {/* User Profile Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//                 <Avatar className="h-8 w-8">
//                   <AvatarFallback className="bg-primary/10 text-primary">
//                     {getUserInitials()}
//                   </AvatarFallback>
//                 </Avatar>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-56" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="text-sm font-medium leading-none">{getUserName()}</p>
//                   <p className="text-xs leading-none text-muted-foreground">
//                     {user?.email || ""}
//                   </p>

//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => router.push('/profile')}
//                 className="cursor-pointer"
//               >
//                 <User className="mr-2 h-4 w-4" />
//                 <span>Profile</span>
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={handleLogout}
//                 className="cursor-pointer text-red-600 focus:text-red-600"
//               >
//                 <LogOut className="mr-2 h-4 w-4" />
//                 <span>Logout</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   )
// }

// components/site-header.tsx
"use client";

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { LogOut, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { logout as guardLogout } from "@/store/slices/authSlice"
import { clientLogout } from "@/store/slices/client/clientProfileSlice"
import { useRouter } from "next/navigation"
import SweetAlertService from "@/lib/sweetAlert"
import { useAppSelector } from "@/hooks/useAppSelector";

export function SiteHeader() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user: guardUser } = useAppSelector((state) => state.auth)
  const { client } = useAppSelector((state) => state.clientProfile)

  // Determine which user is logged in
  const userType = typeof window !== 'undefined' ? localStorage.getItem('user_type') : null
  const isClient = userType === 'client'
  
  // Get the appropriate user data
  const user = isClient ? client : guardUser

  const handleLogout = async () => {
    const result = await SweetAlertService.confirm(
      'Logout Confirmation',
      'Are you sure you want to logout?',
      'Yes, Logout',
      'Cancel'
    )

    if (result.isConfirmed) {
      const userType = localStorage.getItem('user_type')
      
      // Dispatch appropriate logout action
      if (userType === 'client') {
        await dispatch(clientLogout())
      } else {
        await dispatch(guardLogout())
      }

      // Clear all localStorage items
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      localStorage.removeItem('client_token')
      localStorage.removeItem('client_user')
      localStorage.removeItem('user_type')
      
      // Clear guard-specific items
      localStorage.removeItem('guard_tracking_active')
      localStorage.removeItem('locationIntervalId')
      localStorage.removeItem('heartbeatIntervalId')
      localStorage.removeItem('device_id')

      // Stop any running intervals if needed
      const heartbeatIntervalId = localStorage.getItem('heartbeatIntervalId')
      if (heartbeatIntervalId) {
        clearInterval(parseInt(heartbeatIntervalId))
      }

      // Redirect to login page
      router.push('/auth/login')
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return isClient ? "CL" : "GU"
    
    if (isClient && client) {
      return client.full_name?.charAt(0).toUpperCase() || "CL"
    }
    
    if (guardUser) {
      const firstName = guardUser.first_name?.charAt(0) || ""
      const lastName = guardUser.last_name?.charAt(0) || ""
      return `${firstName}${lastName}`.toUpperCase() || "GU"
    }
    
    return isClient ? "CL" : "GU"
  }

  // Get user display name
  const getUserName = () => {
    if (!user) return isClient ? "Client User" : "Guest"
    
    if (isClient && client) {
      return client.full_name || client.company_name || "Client User"
    }
    
    if (guardUser) {
      return `${guardUser.first_name || ""} ${guardUser.last_name || ""}`.trim() || guardUser.email || "Guard User"
    }
    
    return "User"
  }

  // Get user email
  const getUserEmail = () => {
    if (!user) return ""
    
    if (isClient && client) {
      return client.email || ""
    }
    
    if (guardUser) {
      return guardUser.email || ""
    }
    
    return ""
  }

  // Get profile route based on user type
  const getProfileRoute = () => {
    return isClient ? '/client/profile' : '/profile'
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">
          {isClient ? 'Client Dashboard' : 'Dashboard'}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {/* User Type Badge */}
          <div className={`hidden sm:block px-2 py-1 rounded-md text-xs font-medium ${
            isClient 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {isClient ? 'Client' : 'Guard'}
          </div>
          
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={isClient ? client?.profile_image_url : undefined} />
                  <AvatarFallback className={isClient ? "bg-blue-100 text-blue-700" : "bg-primary/10 text-primary"}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getUserName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {getUserEmail()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground mt-1">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-xs ${
                      isClient 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {isClient ? 'Client Account' : 'Guard Account'}
                    </span>
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push(getProfileRoute())}
                className="cursor-pointer"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}