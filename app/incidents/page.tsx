import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { HeaderCard } from "@/components/incidents/header-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { IncidentList } from "@/components/incidents/incident-list"
import Link from "next/link"
import { BottomNav } from "@/components/bottom-nav"
import { bottomNavItems } from "@/components/bottom-nav-icon"

// app/incidents/page.tsx
const sampleIncidents = [
  {
    id: 1,
    title: "Incident Report",
    time: "03:15 PM",
    reporter: "You",
    reporterName: "-",
    trackingCode: "1515532121",
    siteName: "GBR 🟢",
    incidentPlace: "On Site",
    incidentDate: "11/04/2025",
    incidentTime: "03:45 AM",
    incidentLocation: "Gate 4, Industrial Complex",
    incidentAddress: "Ut atque soluta quas",
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
    title: "Incident Report",
    time: "01:15 PM",
    reporter: "You",
    reporterName: "-",
    trackingCode: "1515532122",
    siteName: "Site B 🟡",
    incidentPlace: "Off Site",
    incidentDate: "12/04/2025",
    incidentTime: "02:30 PM",
    incidentLocation: "Building A, Office Complex",
    incidentAddress: "123 Main Street",
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

                    <Link href="/incidents/add-incident">
                        <Button className="w-full bg-[#5F0015] text-white font-bold hover:bg-[#5F0015]/90">
                            <Plus className="mr-2 h-4 w-4" />
                            Add New
                        </Button>
                    </Link>


                    {/* Reports List */}
                    <div className="">
                        <IncidentList incidents={sampleIncidents} />
                    </div>
                </main>
                <BottomNav items={bottomNavItems} />
            </SidebarInset>
        </SidebarProvider>
    )
}