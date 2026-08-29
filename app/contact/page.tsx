'use client'

import {
  Phone,
  Mail,
  MapPin,
  Shield,
  Building,
  Globe,
  CheckCircle,
  Users,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import Link from "next/link"

const locations = [
  {
    address: "596 Industry Dr, Tukwila WA 98188",
    phone: "+1 (206) 610-2400",
    email: "contact@1guardsecurity.com",
    icon: Building,
  },
  {
    address: "8920 Emerald Park Drive, Suite #G, Elk Grove, CA 95624",
    phone: "+1 (510) 912-7997",
    email: "info@1guard.com",
    icon: Building,
  },
]

const exploreLinks = [
  { label: "Employment", href: "#" },
  { label: "Services", href: "#" },
  { label: "Industries", href: "#" },
  { label: "Areas", href: "#" },
]

const policyLinks = [
  { label: "Business Model", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Security Officer Policy", href: "#" },
  { label: "Client Privacy Policy", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Cookie Policy", href: "#" },
  { label: "California Privacy Notice (CCPA/CPRA)", href: "#" },
  { label: "Copyright & Legal Notice", href: "#" },
]

const services = [
  "Access Control & Gate Security",
  "Fire Watch & Rapid Alarm Response",
  "Professional Event Security Solutions",
  "Executive & Personal Protection Services",
  "Loss Prevention & Retail Security",
  "Armed Patrol Security Services",
]

const stats = [
  {
    icon: Shield,
    label: "Licensed & Insured",
    description: "Fully certified security professionals",
  },
  {
    icon: Clock,
    label: "24/7 Availability",
    description: "Round-the-clock protection services",
  },
  {
    icon: Users,
    label: "Expert Team",
    description: "Trained security personnel",
  },
  {
    icon: CheckCircle,
    label: "Trusted Service",
    description: "PPO No. 45214",
  },
]

export default function ContactPage() {
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
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 pb-24 pt-4 sm:px-6 lg:pb-6 lg:px-8">

          {/* Header Section */}
          <div className="relative rounded-2xl bg-gradient-to-r from-[#6b0016] to-[#8b001e] p-8 text-white overflow-hidden">
            <div className="relative z-10">
              <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-0">
                <Shield className="mr-2 h-3 w-3" />
                PPO No. 45214
              </Badge>
              <h1 className="text-3xl font-bold mb-3">Contact OneGuard Security</h1>
              <p className="text-white/80 max-w-2xl">
                Professional security services you can trust. Available 24/7 for all your security needs.
              </p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
              <Shield className="h-full w-full" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-4">
                  <div className="mx-auto w-10 h-10 rounded-full bg-[#6b0016]/10 flex items-center justify-center mb-2">
                    <stat.icon className="h-5 w-5 text-[#6b0016]" />
                  </div>
                  <p className="text-sm font-semibold">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Locations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-[#6b0016]/10">
                      <MapPin className="h-5 w-5 text-[#6b0016]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Building className="h-4 w-4 text-muted-foreground" />
                        Office Location
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                        {location.address}
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`tel:${location.phone.replace(/\s/g, '')}`}
                          className="flex items-center gap-2 text-sm text-[#6b0016] hover:text-[#6b0016]/80 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          {location.phone}
                        </a>
                        <a
                          href={`mailto:${location.email}`}
                          className="flex items-center gap-2 text-sm text-[#6b0016] hover:text-[#6b0016]/80 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          {location.email}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Explore */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Explore</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {exploreLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#6b0016] transition-colors"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {policyLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#6b0016] transition-colors"
                      >
                        <ChevronRight className="h-3 w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Our Services */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Our Services</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {services.map((service, index) => (
                    <li key={index}>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-[#6b0016] transition-colors"
                      >
                        <ChevronRight className="h-3 w-3 flex-shrink-0" />
                        <span>{service}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

        

        </main>
        <BottomNav />
      </SidebarInset>
    </SidebarProvider>
  )
}
