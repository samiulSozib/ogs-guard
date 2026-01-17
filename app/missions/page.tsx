import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeaderCard } from "@/components/missions/header-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { MissionList } from "@/components/missions/mission-list"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"

// app/missions/page.tsx
const sampleMissions = [
  {
    id: 1,
    title: "Site Name",
    time: "03:15 PM",
    reporter: "You",
    reporterName: "-",
    trackingCode: "1515532121",
    siteName: "GBR 🟢",
    missionPlace: "On Site",
    missionDate: "11/04/2025",
    missionTime: "03:45 AM",
    missionLocation: "Gate 4, Industrial Complex",
    missionAddress: "Ut atque soluta quas",
    document: "document.pdf",
    images: [
      "/img/h1.png",
      "/img/h2.png",
      "/img/h3.png",
    ],
    note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    id: 2,
    title: "Site Name",
    time: "01:15 PM",
    reporter: "You",
    reporterName: "-",
    trackingCode: "1515532122",
    siteName: "Site B 🟡",
    missionPlace: "Off Site",
    missionDate: "12/04/2025",
    missionTime: "02:30 PM",
    missionLocation: "Building A, Office Complex",
    missionAddress: "123 Main Street",
    document: "report.pdf",
    images: [
      "/img/h1.png",
      "/img/h2.png",
      "/img/h3.png",
    ],
    note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry."
  },
]

export default function ReportsPage() {
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

                {/* Reports Content */}
                <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <HeaderCard />

                    


                    {/* Reports List */}
                    <div className="">
                        <MissionList missions={sampleMissions} />
                    </div>
                </main>
                <BottomNav items={bottomNavItems} />
            </SidebarInset>
        </SidebarProvider>
    )
}