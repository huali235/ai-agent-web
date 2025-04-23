import { NextResponse } from 'next/server'
import { getReadwiseHighlights } from '@/lib/server/tools/readwise'

export async function GET() {
  try {
    const highlights = await getReadwiseHighlights()
    return NextResponse.json(highlights)
  } catch (error) {
    console.error('Error in Readwise API route:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Readwise highlights' },
      { status: 500 }
    )
  }
}
