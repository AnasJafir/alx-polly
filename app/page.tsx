"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"

export default function Home() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Create, Share, and{" "}
            <span className="text-blue-600">Vote</span> on Polls
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Engage with the ALX community by creating interactive polls and discovering what others think. 
            Simple, fast, and fun polling platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/polls">Browse Polls</Link>
            </Button>
            {user ? (
              <Button size="lg" variant="outline" asChild>
                <Link href="/polls/create">Create Poll</Link>
              </Button>
            ) : (
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose ALX Polling?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Easy Creation
                </CardTitle>
                <CardDescription>
                  Create polls in seconds with our intuitive interface. Add multiple options and descriptions to make your questions clear.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🗳️</span>
                  Simple Voting
                </CardTitle>
                <CardDescription>
                  Vote on polls with just one click. See real-time results and percentages as votes come in.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Community Driven
                </CardTitle>
                <CardDescription>
                  Connect with fellow ALX developers, share insights, and discover what the community thinks about various topics.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {user ? "Ready to Create More Polls?" : "Ready to Get Started?"}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {user 
              ? "Keep engaging with the community and share your thoughts!"
              : "Join the community and start creating polls today!"
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Button size="lg" asChild>
                  <Link href="/polls/create">Create New Poll</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/polls">View All Polls</Link>
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/auth/register">Sign Up Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/polls">Explore Polls</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
