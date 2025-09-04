import { NextRequest, NextResponse } from 'next/server'
import { submitVote } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { isSameOriginRequest } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const supabase = await createServerSupabaseClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Parse the request body
    const body = await request.json()
    const { poll_id, option_ids } = body
    
    if (!poll_id || !option_ids || !Array.isArray(option_ids)) {
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      )
    }

    // Submit the vote
    const success = await submitVote({ poll_id, option_ids }, user.id)
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to submit vote' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting vote:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
