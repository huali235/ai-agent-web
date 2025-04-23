import type OpenAI from 'openai'
import { getWeather } from './weather'
import { handleCalendarRequest } from './dateParsing'
import { getReadwiseHighlights } from './readwise'

export const runTool = async (
  toolCall: OpenAI.Chat.Completions.ChatCompletionMessageToolCall,
  userMessage: string
) => {
  const input = {
    userMessage,
    toolArgs: JSON.parse(toolCall.function.arguments || '{}'),
  }

  switch (toolCall.function.name) {
    case 'get_weather':
      return getWeather(input.toolArgs)
    case 'get_calendar_events':
      return handleCalendarRequest(input.userMessage)
    case 'get_readwise_highlights':
      return getReadwiseHighlights()
    default:
      throw new Error(`Unknown tool: ${toolCall.function.name}`)
  }
}
