"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log("Login attempt:", { email, password })
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <a href="/auth/register" className="text-primary hover:underline">
            Sign up
          </a>
        </div>
      </CardContent>
    </Card>
  )
}
