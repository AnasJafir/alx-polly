"use client"

import { useState } from "react"
import { PollCard } from "@/components/polls/poll-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Mock data for demonstration
const mockPolls = [
  {
    id: "1",
    question: "What's your favorite programming language?",
    description: "Choose the language you enjoy coding in the most",
    options: [
      { id: "1-1", text: "JavaScript/TypeScript", votes: 45 },
      { id: "1-2", text: "Python", votes: 38 },
      { id: "1-3", text: "Java", votes: 22 },
      { id: "1-4", text: "C++", votes: 15 }
    ],
    totalVotes: 120,
    createdAt: "2024-01-15T10:00:00Z",
    createdBy: "John Doe"
  },
  {
    id: "2",
    question: "Which framework do you prefer for web development?",
    description: "Select your go-to web framework",
    options: [
      { id: "2-1", text: "React", votes: 52 },
      { id: "2-2", text: "Vue.js", votes: 28 },
      { id: "2-3", text: "Angular", votes: 20 },
      { id: "2-4", text: "Svelte", votes: 12 }
    ],
    totalVotes: 112,
    createdAt: "2024-01-14T15:30:00Z",
    createdBy: "Jane Smith"
  }
]

export default function PollsPage() {
  const [polls, setPolls] = useState(mockPolls)
  const [searchTerm, setSearchTerm] = useState("")

  const handleVote = (pollId: string, optionId: string) => {
    setPolls(prevPolls => 
      prevPolls.map(poll => {
        if (poll.id === pollId) {
          return {
            ...poll,
            options: poll.options.map(option => 
              option.id === optionId 
                ? { ...option, votes: option.votes + 1 }
                : option
            ),
            totalVotes: poll.totalVotes + 1
          }
        }
        return poll
      })
    )
  }

  const filteredPolls = polls.filter(poll =>
    poll.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Polls</h1>
          <p className="text-gray-600">Discover and vote on polls created by the community</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search polls..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Button asChild>
            <a href="/polls/create">Create New Poll</a>
          </Button>
        </div>

        {filteredPolls.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 text-lg">
                {searchTerm ? "No polls found matching your search." : "No polls available yet."}
              </p>
              {!searchTerm && (
                <Button asChild className="mt-4">
                  <a href="/polls/create">Create the first poll</a>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredPolls.map((poll) => (
              <PollCard key={poll.id} poll={poll} onVote={handleVote} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
