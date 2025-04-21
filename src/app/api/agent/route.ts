import { NextRequest, NextResponse } from 'next/server'
import { runAgent } from '@/lib/server/core/agent'
import { calendarTool, weatherTool } from '@/lib/server/tools/toolDefinitions'
import { v4 as uuid } from 'uuid'
import type { AIMessage } from '@/lib/client/types' // Import your AIMessage type

export async function POST(req: NextRequest) {
  try {
    console.log('API Request received!')
    const { messages } = await req.json()
    console.log('Received messages:', messages)

    // Get the last user message from the messages array
    const lastUserMessage =
      messages.filter((msg: { role: string }) => msg.role === 'user').pop()
        ?.content || ''

    // Run the agent server-side
    const agentMessages: AIMessage[] = await runAgent({
      userMessage: lastUserMessage,
      tools: [weatherTool, calendarTool],
    })

    // Transform AIMessages to DisplayMessages by adding IDs
    const displayMessages = agentMessages.map((msg) => ({
      role: msg.role,
      content:
        typeof msg.content === 'string'
          ? msg.content
          : JSON.stringify(msg.content),
      id: uuid(), // Generate a new ID for each message
    }))
    console.log(displayMessages)

    return NextResponse.json({ messages: displayMessages })
  } catch (error) {
    console.error('Error processing chat:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
