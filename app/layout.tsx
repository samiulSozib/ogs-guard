"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { usePathname } from "next/navigation";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { AlertProvider } from "@/components/contexts/AlertContext";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { SweetAlertProvider } from "@/components/providers/sweetAlertProvider";
import GuardedRoute from "@/components/authGuardedRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Public routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/reset-password",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isPublicRoute = publicRoutes.includes(pathname);

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider store={store}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SweetAlertProvider />
            {isPublicRoute ? (
              // Public routes (login, register, etc.) - no protection
              <AlertProvider>
                <main className="flex flex-1 flex-col h-full">
                  {children}
                </main>
              </AlertProvider>
            ) : (
              // Protected routes - require authentication
              <GuardedRoute>
                <AlertProvider>
                  <main className="flex flex-1 flex-col h-full">
                    {children}
                  </main>
                </AlertProvider>
              </GuardedRoute>
            )}
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
