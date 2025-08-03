"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  isAdminPage?: boolean
}

export function Header({ isAdminPage = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect shadow-lg transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-violet-500/10 to-blue-500/10"></div>
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Company Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/images/epi-use-logo.webp"
            alt="EPI-USE Logo"
            width={120}
            height={40}
            className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
            priority
          />
        </Link>

        <div className="flex items-center gap-4 relative z-10">
          <ThemeToggle />
          {isAdminPage ? (
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="glass-card hover:bg-white/20 border-white/30 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Email Review
              </Button>
            </Link>
          ) : (
            <Link href="/admin">
              <Button
                variant="outline"
                size="lg"
                className="glass-card hover:bg-white/20 border-white/30 text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
              >
                <Settings className="h-5 w-5 mr-2" />
                Admin
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
