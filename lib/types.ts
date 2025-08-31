export type PollStatus = 'active' | 'closed' | 'draft'
export type PollType = 'single_choice' | 'multiple_choice' | 'ranking'
export type ShareType = 'link' | 'qr' | 'embed'

export interface Profile {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Poll {
  id: string
  title: string
  description?: string
  question: string
  poll_type: PollType
  status: PollStatus
  is_public: boolean
  allow_multiple_votes: boolean
  max_votes_per_option: number
  expires_at?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface PollOption {
  id: string
  poll_id: string
  text: string
  description?: string
  order_index: number
  created_at: string
}

export interface Vote {
  id: string
  poll_id: string
  option_id: string
  voter_id: string
  created_at: string
}

export interface PollShare {
  id: string
  poll_id: string
  shared_by: string
  share_type: ShareType
  share_url?: string
  created_at: string
}

export interface PollWithOptions extends Poll {
  options: PollOption[]
  total_votes: number
  user_has_voted: boolean
  user_votes: string[]
}

export interface PollResults {
  option_id: string
  option_text: string
  vote_count: number
  percentage: number
}

export interface CreatePollData {
  title: string
  description?: string
  question: string
  poll_type: PollType
  is_public: boolean
  allow_multiple_votes: boolean
  max_votes_per_option: number
  expires_at?: string
  options: {
    text: string
    description?: string
    order_index: number
  }[]
}

export interface VoteData {
  poll_id: string
  option_ids: string[]
}

export interface PollFilters {
  status?: PollStatus
  poll_type?: PollType
  is_public?: boolean
  created_by?: string
  search?: string
  limit?: number
  offset?: number
}
