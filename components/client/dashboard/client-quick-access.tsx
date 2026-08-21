// components/client/client-quick-access.tsx
'use client';

import {
  Building,
  FileText,
  AlertTriangle,
  CreditCard,
  Plus,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const quickAccessItems = [
  {
    title: "New Site Request",
    description: "Request guards for a new location.",
    icon: Building,
    href: "/client/sites/create",
  },
  {
    title: "Incident Report",
    description: "Report any incidents or issues at your site.",
    icon: AlertTriangle,
    href: "/client/incidents/report",
  },
  {
    title: "Payment History",
    description: "View your payment records and invoices.",
    icon: CreditCard,
    href: "/client/payments",
  },
  {
    title: "List of Reports",
    description: "Access all your security reports.",
    icon: FileText,
    href: "/client/reports",
  },
];

export function ClientQuickAccess() {
  return (
    <>
      {/* Mobile Design (Horizontal Scroll - Same Size Cards) */}
      <div className="block lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link key={index} href={item.href} className="w-[220px] flex-shrink-0 snap-start">
                <div
                  className="
                    group
                    relative
                    h-full
                    overflow-hidden
                    rounded-2xl
                    bg-gray-50
                    p-4
                    text-gray-900
                    shadow-sm
                    transition-all
                    duration-300
                    active:scale-[0.98]
                    hover:bg-[#2a0008]
                    hover:text-white
                    hover:shadow-md
                    dark:bg-gray-800
                    dark:text-white
                  "
                >
                  {/* Plus Button - Only visible on hover */}
                  <div className="absolute right-0 top-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-bl-2xl bg-white shadow-md">
                      <Plus className="h-5 w-5 text-[#6b0015]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="max-w-[85%]">
                    <h3 className="text-base font-bold leading-tight group-hover:text-white">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-xs text-gray-500 group-hover:text-white/70 dark:text-gray-400">
                      {item.description}
                    </p>
                  </div>

                  {/* Icon */}
                  <div className="mt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 group-hover:bg-white/10 dark:bg-gray-700">
                      <Icon className="h-5 w-5 text-[#6b0015] group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop Design (Same Size Cards - Light Gray Background) */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-1 gap-3">
          {quickAccessItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link key={index} href={item.href}>
                <div
                  className="
                    group
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    rounded-xl
                    bg-gray-50
                    p-4
                    shadow-sm
                    transition-all
                    duration-300
                    hover:bg-[#2a0008]
                    hover:shadow-md
                    dark:bg-gray-800
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-gray-200
                        transition-all
                        duration-300
                        group-hover:bg-white/10
                        dark:bg-gray-700
                      "
                    >
                      <Icon className="h-5 w-5 text-[#6b0015] transition-colors duration-300 group-hover:text-white" />
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 transition-colors duration-300 group-hover:text-white dark:text-white">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-500 transition-colors duration-300 group-hover:text-white/70 dark:text-gray-400">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ChevronRight className="h-4 w-4 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}