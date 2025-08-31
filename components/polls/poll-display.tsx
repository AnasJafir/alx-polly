"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { PollWithOptions, PollResults } from "@/lib/types"
import { formatDistanceToNow } from 'date-fns'

interface PollDisplayProps {
  poll: PollWithOptions
}

export function PollDisplay({ poll }: PollDisplayProps) {
  const { user } = useAuth()
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    poll.user_has_voted ? poll.user_votes : []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [showResults, setShowResults] = useState(poll.user_has_voted)

  const handleOptionSelect = (optionId: string) => {
    if (poll.poll_type === 'single_choice') {
      setSelectedOptions([optionId])
    } else {
      setSelectedOptions(prev => 
        prev.includes(optionId)
          ? prev.filter(id => id !== optionId)
          : [...prev, optionId]
      )
    }
  }

  const handleVote = async () => {
    if (!user) {
      setError("Please sign in to vote")
      return
    }

    if (selectedOptions.length === 0) {
      setError("Please select at least one option")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poll_id: poll.id,
          option_ids: selectedOptions
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit vote')
      }

      setSuccess("Vote submitted successfully!")
      setShowResults(true)
      // Refresh the page to show updated results
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit vote')
    } finally {
      setLoading(false)
    }
  }

  const isExpired = poll.expires_at && new Date(poll.expires_at) < new Date()
  const canVote = !isExpired && poll.status === 'active' && !poll.user_has_voted

  return (
    <div className="space-y-6">
      {/* Poll Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{poll.title}</h1>
        <p className="text-lg text-gray-600 mb-4">{poll.question}</p>
        {poll.description && (
          <p className="text-gray-500 mb-4">{poll.description}</p>
        )}
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>Created by {poll.created_by}</span>
          <span>•</span>
          <span>{formatDistanceToNow(new Date(poll.created_at), { addSuffix: true })}</span>
          {poll.expires_at && (
            <>
              <span>•</span>
              <span>Expires {formatDistanceToNow(new Date(poll.expires_at), { addSuffix: true })}</span>
            </>
          )}
        </div>
      </div>

      {/* Poll Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vote Options</span>
            <span className="text-sm font-normal text-gray-500">
              {poll.total_votes} vote{poll.total_votes !== 1 ? 's' : ''}
            </span>
          </CardTitle>
          <CardDescription>
            {poll.poll_type === 'single_choice' 
              ? 'Select one option' 
              : `Select up to ${poll.max_votes_per_option} option${poll.max_votes_per_option !== 1 ? 's' : ''}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {poll.options.map((option) => (
            <div
              key={option.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedOptions.includes(option.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => canVote && handleOptionSelect(option.id)}
            >
              <div className="flex items-center space-x-3">
                <input
                  type={poll.poll_type === 'single_choice' ? 'radio' : 'checkbox'}
                  checked={selectedOptions.includes(option.id)}
                  onChange={() => canVote && handleOptionSelect(option.id)}
                  disabled={!canVote}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <p className="font-medium">{option.text}</p>
                  {option.description && (
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Error and Success Messages */}
      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 text-sm text-green-500 bg-green-50 border border-green-200 rounded-md">
          {success}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {canVote && (
          <Button
            onClick={handleVote}
            disabled={loading || selectedOptions.length === 0}
            size="lg"
          >
            {loading ? "Submitting..." : "Submit Vote"}
          </Button>
        )}
        
        {!canVote && poll.user_has_voted && (
          <Button
            onClick={() => setShowResults(!showResults)}
            variant="outline"
            size="lg"
          >
            {showResults ? "Hide Results" : "Show Results"}
          </Button>
        )}

        {isExpired && (
          <div className="text-center">
            <p className="text-red-600 font-medium">This poll has expired</p>
            <Button
              onClick={() => setShowResults(true)}
              variant="outline"
              size="lg"
              className="mt-2"
            >
              View Results
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      {showResults && (
        <Card>
          <CardHeader>
            <CardTitle>Poll Results</CardTitle>
          </CardHeader>
          <CardContent>
            <PollResults pollId={poll.id} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Separate component for poll results
function PollResults({ pollId }: { pollId: string }) {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useState(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`/api/polls/${pollId}/results`)
        if (response.ok) {
          const data = await response.json()
          setResults(data)
        }
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [pollId])

  if (loading) {
    return <div className="animate-pulse space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-8 bg-gray-200 rounded"></div>
      ))}
    </div>
  }

  if (results.length === 0) {
    return <p className="text-gray-500 text-center">No votes yet</p>
  }

  const maxVotes = Math.max(...results.map(r => r.vote_count))

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.option_id} className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{result.option_text}</span>
            <span className="text-gray-500">
              {result.vote_count} vote{result.vote_count !== 1 ? 's' : ''} ({result.percentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(result.vote_count / maxVotes) * 100}%`
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  )
}
