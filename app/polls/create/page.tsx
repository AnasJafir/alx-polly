import { CreatePollForm } from "@/components/polls/create-poll-form"

export default function CreatePollPage() {
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
          <a 
            href="/polls" 
            className="text-primary hover:underline text-sm"
          >
            ← Back to all polls
          </a>
        </div>
      </div>
    </div>
  )
}
