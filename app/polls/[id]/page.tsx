import { notFound } from 'next/navigation'
import { getPoll } from '@/lib/database'
import { PollDisplay } from '@/components/polls/poll-display'

interface PollPageProps {
  params: {
    id: string
  }
}

export default async function PollPage({ params }: PollPageProps) {
  const poll = await getPoll(params.id)

  if (!poll) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PollDisplay poll={poll} />
      </div>
    </div>
  )
}
