"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CreatePollForm() {
  const [formData, setFormData] = useState({
    question: "",
    description: "",
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
    // TODO: Implement poll creation logic
    console.log("Creating poll:", formData)
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

          <Button type="submit" className="w-full" disabled={formData.question.trim() === ""}>
            Create Poll
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
