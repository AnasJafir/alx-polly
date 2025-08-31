"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export function Navigation() {
  const { user, loading, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-900">
                ALX Polling
              </Link>
            </div>
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

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
            {user && (
              <Link 
                href="/polls/create" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Create Poll
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
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
