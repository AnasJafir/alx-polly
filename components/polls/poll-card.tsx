"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PollOption {
  id: string
  text: string
  votes: number
}

interface Poll {
  id: string
  question: string
  description?: string
  options: PollOption[]
  totalVotes: number
  createdAt: string
  createdBy: string
}

interface PollCardProps {
  poll: Poll
  onVote?: (pollId: string, optionId: string) => void
}

export function PollCard({ poll, onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string>("")
  const [hasVoted, setHasVoted] = useState(false)

  const handleVote = () => {
    if (!selectedOption) return
    
    if (onVote) {
      onVote(poll.id, selectedOption)
    }
    setHasVoted(true)
  }

  const getVotePercentage = (votes: number) => {
    if (poll.totalVotes === 0) return 0
    return Math.round((votes / poll.totalVotes) * 100)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">{poll.question}</CardTitle>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        <div className="text-sm text-muted-foreground">
          Created by {poll.createdBy} • {new Date(poll.createdAt).toLocaleDateString()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasVoted ? (
          <>
            <div className="space-y-3">
              {poll.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    id={option.id}
                    name={`poll-${poll.id}`}
                    value={option.id}
                    checked={selectedOption === option.id}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="h-4 w-4"
                  />
                  <label htmlFor={option.id} className="text-sm font-medium">
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleVote} 
              disabled={!selectedOption}
              className="w-full"
            >
              Vote
            </Button>
          </>
        ) : (
          <div className="space-y-3">
            {poll.options.map((option) => {
              const percentage = getVotePercentage(option.votes)
              return (
                <div key={option.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{option.text}</span>
                    <span className="font-medium">{option.votes} votes ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
            <div className="text-center text-sm text-muted-foreground pt-2">
              Total votes: {poll.totalVotes}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
