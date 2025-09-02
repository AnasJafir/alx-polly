import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatePollForm } from '@/components/polls/create-poll-form'

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ user: { id: 'user-1', email: 'test@example.com' } }),
}))

const mockFetch = (status: number, json: any) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
  } as any)
}

describe('CreatePollForm - unit success cases', () => {
  test('submits valid single choice poll and navigates to poll page', async () => {
    mockFetch(200, { id: 'poll-123' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'My Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Best color?')

    const optionInputs = screen.getAllByPlaceholderText(/Option \/d+/)
    await userEvent.type(optionInputs[0], 'Red')
    await userEvent.type(optionInputs[1], 'Blue')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/polls', expect.objectContaining({ method: 'POST' }))
    })

    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith('/polls/poll-123')
  })

  test('allows adding an option and submits with three options', async () => {
    mockFetch(201, { id: 'poll-999' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'Food Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Best fruit?')

    await userEvent.click(screen.getByRole('button', { name: 'Add Another Option' }))
    const optionInputs = screen.getAllByPlaceholderText(/Option \/d+/)
    await userEvent.type(optionInputs[0], 'Apple')
    await userEvent.type(optionInputs[1], 'Banana')
    await userEvent.type(optionInputs[2], 'Orange')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith('/polls/poll-999')
  })
})

describe('CreatePollForm - integration failure case', () => {
  test('shows server error when API returns 400 and does not navigate', async () => {
    mockFetch(400, { error: 'Invalid poll data' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'Bad Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Why?')

    const optionInputs = screen.getAllByPlaceholderText(/Option \/d+/)
    await userEvent.type(optionInputs[0], 'A')
    await userEvent.type(optionInputs[1], 'B')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid poll data')).toBeInTheDocument()
    })

    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).not.toHaveBeenCalled()
  })
})

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreatePollForm } from '@/components/polls/create-poll-form'

// Mock auth context to simulate authenticated/unauthenticated states
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({ user: { id: 'user-1', email: 'test@example.com' } }),
}))

// Helper to mock fetch responses
const mockFetch = (status: number, json: any) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: async () => json,
  } as any)
}

describe('CreatePollForm - unit success cases', () => {
  test('submits valid single choice poll and navigates to poll page', async () => {
    mockFetch(200, { id: 'poll-123' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'My Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Best color?')

    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
    await userEvent.type(optionInputs[0], 'Red')
    await userEvent.type(optionInputs[1], 'Blue')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/polls', expect.objectContaining({ method: 'POST' }))
    })

    // Router push mocked in jest.setup.ts; assert it was called
    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith('/polls/poll-123')
  })

  test('allows adding an option and submits with three options', async () => {
    mockFetch(201, { id: 'poll-999' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'Food Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Best fruit?')

    await userEvent.click(screen.getByRole('button', { name: 'Add Another Option' }))
    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
    await userEvent.type(optionInputs[0], 'Apple')
    await userEvent.type(optionInputs[1], 'Banana')
    await userEvent.type(optionInputs[2], 'Orange')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })

    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).toHaveBeenCalledWith('/polls/poll-999')
  })
})

describe('CreatePollForm - integration failure case', () => {
  test('shows server error when API returns 400 and does not navigate', async () => {
    mockFetch(400, { error: 'Invalid poll data' })

    render(<CreatePollForm />)

    await userEvent.type(screen.getByLabelText('Poll Title *'), 'Bad Poll')
    await userEvent.type(screen.getByLabelText('Question *'), 'Why?')

    const optionInputs = screen.getAllByPlaceholderText(/Option \d+/)
    await userEvent.type(optionInputs[0], 'A')
    await userEvent.type(optionInputs[1], 'B')

    await userEvent.click(screen.getByRole('button', { name: 'Create Poll' }))

    await waitFor(() => {
      expect(screen.getByText('Invalid poll data')).toBeInTheDocument()
    })

    const { useRouter } = jest.requireMock('next/navigation')
    const router = useRouter()
    expect(router.push).not.toHaveBeenCalled()
  })
})


