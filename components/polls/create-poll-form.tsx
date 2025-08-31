"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { PollType } from "@/lib/types"

export function CreatePollForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    title: "",
    question: "",
    description: "",
    poll_type: "single_choice" as PollType,
    is_public: true,
    allow_multiple_votes: false,
    max_votes_per_option: 1,
    expires_at: "",
    options: ["", ""]
  })

  const addOption = () => {
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, ""]
    }))
  }

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }))
  }

  const updateOption = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => i === index ? value : option)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate form data
    if (formData.title.trim() === "") {
      setError("Poll title is required")
      setLoading(false)
      return
    }

    if (formData.question.trim() === "") {
      setError("Poll question is required")
      setLoading(false)
      return
    }

    if (formData.options.filter(opt => opt.trim() !== "").length < 2) {
      setError("At least 2 options are required")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          options: formData.options
            .filter(opt => opt.trim() !== "")
            .map((opt, index) => ({
              text: opt.trim(),
              order_index: index + 1
            }))
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create poll')
      }

      const poll = await response.json()
      router.push(`/polls/${poll.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create poll')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">
            Please sign in to create polls.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create a New Poll</CardTitle>
        <CardDescription>
          Ask a question and let people vote on the options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Poll Title *
            </label>
            <Input
              id="title"
              placeholder="Give your poll a catchy title..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="question" className="text-sm font-medium">
              Question *
            </label>
            <Input
              id="question"
              placeholder="What would you like to ask?"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Input
              id="description"
              placeholder="Add more context to your question..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="poll_type" className="text-sm font-medium">
                Poll Type
              </label>
              <select
                id="poll_type"
                value={formData.poll_type}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  poll_type: e.target.value as PollType,
                  allow_multiple_votes: e.target.value === 'single_choice' ? false : prev.allow_multiple_votes
                }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="single_choice">Single Choice</option>
                <option value="multiple_choice">Multiple Choice</option>
                <option value="ranking">Ranking</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="max_votes" className="text-sm font-medium">
                Max Votes per Option
              </label>
              <Input
                id="max_votes"
                type="number"
                min="1"
                max="10"
                value={formData.max_votes_per_option}
                onChange={(e) => setFormData(prev => ({ ...prev, max_votes_per_option: parseInt(e.target.value) || 1 }))}
                disabled={formData.poll_type === 'single_choice'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="expires_at" className="text-sm font-medium">
              Expires At (optional)
            </label>
            <Input
              id="expires_at"
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => setFormData(prev => ({ ...prev, expires_at: e.target.value }))}
            />
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.is_public}
                onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Make poll public</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.allow_multiple_votes}
                onChange={(e) => setFormData(prev => ({ ...prev, allow_multiple_votes: e.target.checked }))}
                disabled={formData.poll_type === 'single_choice'}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">Allow multiple votes</span>
            </label>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">
              Options *
            </label>
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  required
                />
                {formData.options.length > 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(index)}
                    className="px-2"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addOption}
              className="w-full"
            >
              Add Another Option
            </Button>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || formData.title.trim() === "" || formData.question.trim() === ""}
          >
            {loading ? "Creating Poll..." : "Create Poll"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
