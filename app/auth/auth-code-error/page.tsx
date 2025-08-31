import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-red-600">Authentication Error</CardTitle>
          <CardDescription>
            There was a problem with the authentication process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            The authentication link may have expired or there was an error processing your request.
          </p>
          <div className="flex space-x-3">
            <Button asChild className="flex-1">
              <Link href="/auth/login">Try Signing In</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">Go Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
