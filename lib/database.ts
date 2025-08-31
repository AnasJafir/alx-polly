import { createServerSupabaseClient } from './supabase-server'
import { 
  Poll, 
  PollOption, 
  Vote, 
  PollWithOptions, 
  PollResults, 
  CreatePollData,
  VoteData,
  PollFilters
} from './types'

// Poll operations
export async function createPoll(pollData: CreatePollData, userId: string): Promise<Poll | null> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Start a transaction by creating the poll first
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({
        title: pollData.title,
        description: pollData.description,
        question: pollData.question,
        poll_type: pollData.poll_type,
        is_public: pollData.is_public,
        allow_multiple_votes: pollData.allow_multiple_votes,
        max_votes_per_option: pollData.max_votes_per_option,
        expires_at: pollData.expires_at || null,
        created_by: userId
      })
      .select()
      .single()

    if (pollError) throw pollError

    // Create poll options
    const optionsWithPollId = pollData.options.map((option, index) => ({
      ...option,
      poll_id: poll.id,
      order_index: option.order_index || index + 1
    }))

    const { error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsWithPollId)

    if (optionsError) throw optionsError

    return poll
  } catch (error) {
    console.error('Error creating poll:', error)
    return null
  }
}

export async function getPoll(pollId: string, userId?: string): Promise<PollWithOptions | null> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Get poll details
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', pollId)
      .single()

    if (pollError || !poll) return null

    // Get poll options
    const { data: options, error: optionsError } = await supabase
      .from('poll_options')
      .select('*')
      .eq('poll_id', pollId)
      .order('order_index', { ascending: true })

    if (optionsError) throw optionsError

    // Get total votes
    const { count: totalVotes, error: votesError } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true })
      .eq('poll_id', pollId)

    if (votesError) throw votesError

    // Check if user has voted (if authenticated)
    let userHasVoted = false
    let userVotes: string[] = []
    
    if (userId) {
      const { data: userVoteData, error: userVoteError } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId)
        .eq('voter_id', userId)

      if (!userVoteError && userVoteData) {
        userHasVoted = userVoteData.length > 0
        userVotes = userVoteData.map(vote => vote.option_id)
      }
    }

    return {
      ...poll,
      options: options || [],
      total_votes: totalVotes || 0,
      user_has_voted: userHasVoted,
      user_votes: userVotes
    }
  } catch (error) {
    console.error('Error fetching poll:', error)
    return null
  }
}

export async function getPolls(filters: PollFilters = {}): Promise<Poll[]> {
  const supabase = await createServerSupabaseClient()
  
  try {
    let query = supabase
      .from('polls')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.poll_type) {
      query = query.eq('poll_type', filters.poll_type)
    }
    if (filters.is_public !== undefined) {
      query = query.eq('is_public', filters.is_public)
    }
    if (filters.created_by) {
      query = query.eq('created_by', filters.created_by)
    }
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,question.ilike.%${filters.search}%`)
    }
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1)
    }

    const { data: polls, error } = await query

    if (error) throw error
    return polls || []
  } catch (error) {
    console.error('Error fetching polls:', error)
    return []
  }
}

// Voting operations
export async function submitVote(voteData: VoteData, userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Check if poll exists and is active
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('status, allow_multiple_votes, max_votes_per_option')
      .eq('id', voteData.poll_id)
      .single()

    if (pollError || !poll) return false
    if (poll.status !== 'active') return false

    // Validate vote count
    if (!poll.allow_multiple_votes && voteData.option_ids.length > 1) {
      throw new Error('Multiple votes not allowed for this poll')
    }

    if (voteData.option_ids.length > poll.max_votes_per_option) {
      throw new Error(`Maximum ${poll.max_votes_per_option} votes allowed`)
    }

    // Remove existing votes for this user and poll
    const { error: deleteError } = await supabase
      .from('votes')
      .delete()
      .eq('poll_id', voteData.poll_id)
      .eq('voter_id', userId)

    if (deleteError) throw deleteError

    // Insert new votes
    const votesToInsert = voteData.option_ids.map(optionId => ({
      poll_id: voteData.poll_id,
      option_id: optionId,
      voter_id: userId
    }))

    const { error: insertError } = await supabase
      .from('votes')
      .insert(votesToInsert)

    if (insertError) throw insertError

    return true
  } catch (error) {
    console.error('Error submitting vote:', error)
    return false
  }
}

export async function getPollResults(pollId: string): Promise<PollResults[]> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Use the custom function we created in the database
    const { data: results, error } = await supabase
      .rpc('get_poll_results', { poll_uuid: pollId })

    if (error) throw error
    return results || []
  } catch (error) {
    console.error('Error fetching poll results:', error)
    return []
  }
}

// Poll management operations
export async function updatePoll(pollId: string, updates: Partial<Poll>, userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Verify user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (pollError || !poll || poll.created_by !== userId) {
      return false
    }

    const { error } = await supabase
      .from('polls')
      .update(updates)
      .eq('id', pollId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating poll:', error)
    return false
  }
}

export async function deletePoll(pollId: string, userId: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
  try {
    // Verify user owns the poll
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .select('created_by')
      .eq('id', pollId)
      .single()

    if (pollError || !poll || poll.created_by !== userId) {
      return false
    }

    // Delete poll (cascades to options, votes, and shares)
    const { error } = await supabase
      .from('polls')
      .delete()
      .eq('id', pollId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting poll:', error)
    return false
  }
}

// User profile operations
export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return profile
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

export async function updateUserProfile(userId: string, updates: Partial<Profile>): Promise<boolean> {
  const supabase = await createServerSupabaseClient()
  
  try {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error updating user profile:', error)
    return false
  }
}
