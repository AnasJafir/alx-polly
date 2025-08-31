import { NextRequest, NextResponse } from 'next/server'
import { getPollResults } from '@/lib/database'

interface ResultsRouteProps {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: ResultsRouteProps) {
  try {
    const results = await getPollResults(params.id)
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching poll results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
