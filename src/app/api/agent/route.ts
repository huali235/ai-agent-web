// src/app/api/agent/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/server/core/agent'
import { calendarTool, weatherTool } from '@/lib/server/tools/toolDefinitions'

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json()

    // Run the agent server-side
    const messages = await runAgent({
      userMessage: message,
      tools: [weatherTool, calendarTool],
      // No UI callbacks needed in API
    })

    return NextResponse.json({ messages })
  } catch (error) {
    console.error('Error processing chat:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
