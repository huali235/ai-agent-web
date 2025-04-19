// In llm.ts
import type { AIMessage } from '../../types'
import { openai } from './ai'
import { zodFunction } from 'openai/src/helpers/zod.js'

export const runLLM = async ({
  messages,
  tools,
}: {
  messages: AIMessage[]
  tools: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
}) => {
  // Make sure to filter out any "orphaned" tool messages
  // (tool messages without a preceding assistant message with tool_calls)

  const formattedTools = tools.map(zodFunction)
  const response = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    temperature: 0.1,
    messages: messages,
    tools: formattedTools,
    tool_choice: 'auto',
    parallel_tool_calls: false,
  })

  return response.choices[0].message
}
