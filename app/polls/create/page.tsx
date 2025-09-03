import { CreatePollForm } from "@/components/polls/create-poll-form"
import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function CreatePollPage() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a New Poll</h1>
          <p className="text-gray-600">
            Ask a question and let the community vote on the options
          </p>
        </div>

        <CreatePollForm />

        <div className="mt-8 text-center">
          <Link 
            href="/polls" 
            className="text-primary hover:underline text-sm"
          >
            ← Back to all polls
          </Link>
        </div>
      </div>
    </div>
  )
}
