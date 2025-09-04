import { NextRequest, NextResponse } from 'next/server'
import { createPoll } from '@/lib/database'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { CreatePollData } from '@/lib/types'
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
    const body: CreatePollData = await request.json()
    
    // Validate required fields
    if (!body.title?.trim()) {
      return NextResponse.json(
        { error: 'Poll title is required' },
        { status: 400 }
      )
    }

    if (!body.question?.trim()) {
      return NextResponse.json(
        { error: 'Poll question is required' },
        { status: 400 }
      )
    }

    if (!body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 options are required' },
        { status: 400 }
      )
    }

    // Validate options
    const validOptions = body.options.filter(opt => opt.text?.trim())
    if (validOptions.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 valid options are required' },
        { status: 400 }
      )
    }

    // Create the poll
    const poll = await createPoll(body, user.id)
    
    if (!poll) {
      return NextResponse.json(
        { error: 'Failed to create poll' },
        { status: 500 }
      )
    }

    return NextResponse.json(poll, { status: 201 })
  } catch (error) {
    console.error('Error creating poll:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient()
    
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const pollType = searchParams.get('poll_type')
    const isPublic = searchParams.get('is_public')
    const createdBy = searchParams.get('created_by')
    const search = searchParams.get('search')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')

    // Build filters
    const filters: any = {}
    if (status) filters.status = status
    if (pollType) filters.poll_type = pollType
    if (isPublic !== null) filters.is_public = isPublic === 'true'
    if (createdBy) filters.created_by = createdBy
    if (search) filters.search = search
    if (limit) filters.limit = parseInt(limit)
    if (offset) filters.offset = parseInt(offset)

    // Get polls with filters
    let query = supabase
      .from('polls')
      .select(`
        *,
        profiles!polls_created_by_fkey(email, full_name),
        poll_options(id, text, order_index),
        votes(count)
      `)
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.status) query = query.eq('status', filters.status)
    if (filters.poll_type) query = query.eq('poll_type', filters.poll_type)
    if (filters.is_public !== undefined) query = query.eq('is_public', filters.is_public)
    if (filters.created_by) query = query.eq('created_by', filters.created_by)
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,question.ilike.%${filters.search}%`)
    }
    if (filters.limit) query = query.limit(filters.limit)
    if (filters.offset) query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)

    const { data: polls, error } = await query

    if (error) throw error

    return NextResponse.json(polls || [])
  } catch (error) {
    console.error('Error fetching polls:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
