import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ReportList } from "@/components/reports/report-list"
import { HeaderCard } from "@/components/reports/header-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddReport } from "@/components/reports/add-report"

const sampleReports = [
  {
    reporterName: "John Doe",
    time: "03:15 PM",
    images: [
      "/img/h1.png",
      "/img/h2.png",
      "/img/h3.png",
    ],
    note: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
  },
  {
    reporterName: "Jane Smith",
    time: "01:15 PM",
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
            <HeaderCard/>

            {/* <Button className="bg-[#5F0015] text-white font-bold"><Plus/>Add New</Button> */}
                      <AddReport />


          {/* Reports List */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <ReportList reports={sampleReports} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}