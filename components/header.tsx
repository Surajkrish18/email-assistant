"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft, Mail, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  isAdminPage?: boolean
}

export function Header({ isAdminPage = false }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-white/20 dark:border-gray-800/20 shadow-lg shadow-purple-500/5">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10"></div>
      <div className="relative max-w-7xl mx-auto flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Company Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/epi-use-logo.webp"
            alt="EPI-USE Logo"
            width={120}
            height={40}
            className="h-10 w-auto filter brightness-0 dark:invert"
            priority
          />
        </Link>

        {/* Center Title - Only show on main page */}
        {!isAdminPage && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <Mail className="h-9 w-9 text-purple-600 dark:text-purple-400" />
              <Sparkles className="h-4 w-4 text-pink-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 bg-clip-text text-transparent transition-colors duration-300">
              Email Review Assistant
            </h1>
          </div>
        )}

        {/* Admin Title - Only show on admin page */}
        {isAdminPage && (
          <div className="flex items-center gap-3">
            <Settings className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent transition-colors duration-300">
              Client Management
            </h1>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm rounded-xl p-1 border border-white/30 dark:border-gray-700/30">
            <ThemeToggle />
          </div>
          {isAdminPage ? (
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/20 bg-white/10 dark:bg-gray-800/10 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm transition-all duration-200"
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
                className="border-white/30 dark:border-gray-700/30 hover:bg-white/20 dark:hover:bg-gray-800/20 bg-white/10 dark:bg-gray-800/10 text-gray-800 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white backdrop-blur-sm transition-all duration-200"
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
