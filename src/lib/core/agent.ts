import { runLLM } from './llm'
import { runTool } from '../tools/toolRunner'
import type { UICallbacks } from '../interfaces/interfaces'
import type { AIMessage } from '../../types'

export const runAgent = async ({
  userMessage,
  tools,
  uiCallbacks = defaultCallbacks,
}: {
  userMessage: string
  tools: any[] // eslint-disable-line @typescript-eslint/no-explicit-any
  uiCallbacks?: UICallbacks
}) => {
  const loader = uiCallbacks.createLoader('🤔')

  // Create properly typed user message
  const userMsg: AIMessage = {
    role: 'user',
    content: userMessage,
  }

  const initialMessages: AIMessage[] = [userMsg]

  // First API call with just the user message
  const response = await runLLM({
    messages: initialMessages,
    tools,
  })

  // If there are no tool calls, just return the response
  if (!response.tool_calls || response.tool_calls.length === 0) {
    uiCallbacks.logMessage(response)
    loader.stop()
    return [userMsg, response]
  }

  // If we get here, we have tool calls to handle
  loader.update('executing tools...')

  // Create an array to collect all messages for this conversation
  const conversationMessages: AIMessage[] = [...initialMessages, response]

  // Process each tool call
  for (const toolCall of response.tool_calls) {
    loader.update(`executing ${toolCall.function.name}...`)

    try {
      const toolCallResponse = await runTool(toolCall, userMessage)
      // Create tool response message with required tool_call_id
      const formattedToolResponse: AIMessage = {
        role: 'tool',
        content:
          typeof toolCallResponse === 'string'
            ? toolCallResponse
            : JSON.stringify(toolCallResponse),
        tool_call_id: toolCall.id,
      }
      conversationMessages.push(formattedToolResponse)
      loader.update(`executed ${toolCall.function.name}`)
    } catch (error) {
      console.error(`Error executing tool ${toolCall.function.name}:`, error)
      const errorResponse: AIMessage = {
        role: 'tool',
        content: `Error executing: ${toolCall.function.name}: ${error}`,
        tool_call_id: toolCall.id,
      }
      conversationMessages.push(errorResponse)
    }
  }

  // Make final API call with all messages from this conversation
  const finalResponse = await runLLM({
    messages: conversationMessages,
    tools,
  })

  // Add final response to conversation
  conversationMessages.push(finalResponse)
  uiCallbacks.logMessage(finalResponse)

  loader.stop()
  return conversationMessages
}

// Default no-op implementations need to be declared before used
const defaultCallbacks: UICallbacks = {
  logMessage: () => {},
  createLoader: () => ({
    stop: () => {},
    succeed: () => {},
    fail: () => {},
    update: () => {},
  }),
}
