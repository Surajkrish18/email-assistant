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
    <header className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-950 shadow-sm dark:shadow-lg transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Company Logo */}
        <Link href="/">
          <Image
            src="/images/epi-use-logo.webp"
            alt="EPI-USE Logo"
            width={120}
            height={40}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          {isAdminPage ? (
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="border-indigo-200 hover:bg-indigo-50 bg-transparent dark:border-gray-600 dark:hover:bg-gray-800"
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
                className="border-indigo-200 hover:bg-indigo-50 bg-transparent dark:border-gray-600 dark:hover:bg-gray-800"
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
