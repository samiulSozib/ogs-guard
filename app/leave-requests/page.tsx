import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { HeaderCard } from "@/components/leave-request/header-card"
import { LeaveList } from "@/components/leave-request/leave-list"
import Link from "next/link"

const sampleLeaves = [
  {
    leaveerName: "John Doe",
    time: "03:15 PM",
    images: [
      "/img/h1.png",
      "/img/h2.png",
      "/img/h3.png",
    ],
    status:'Pending',
    note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    leaveerName: "Jane Smith",
    time: "01:15 PM",
    images: [
      "/img/h1.png",
      "/img/h2.png",
      "/img/h3.png",
    ],
    status:'Approved',
    note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  },
]

export default function LeavesPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "18rem",
          "--header-height": "3.5rem",
        } as React.CSSProperties
      }
    >
      {/* Sidebar (WEB ONLY) */}
      <AppSidebar
        variant="inset"
        collapsible="icon"
        className="hidden lg:flex"
      />

      <SidebarInset>
        {/* App Header (ALL VIEWS) */}
        <SiteHeader />

        {/* Leaves Content */}
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
          {/* Header Section */}
            <HeaderCard/>

            {/* <Button className="bg-[#5F0015] text-white font-bold"><Plus/>Add New</Button> */}
                      <Link href="/leave-requests/add-leave">
                        <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </Link>


          {/* Leaves List */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <LeaveList leaves={sampleLeaves} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}