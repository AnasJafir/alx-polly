"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Navigation() {
  // TODO: Replace with actual authentication state
  const isAuthenticated = false
  const userName = "User"

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              ALX Polling
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/polls" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse Polls
            </Link>
            <Link 
              href="/polls/create" 
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Create Poll
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">Welcome, {userName}</span>
                <Button variant="outline" size="sm">
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
