import type { AIMessage } from '../../client/types'
import { openai } from './ai'
import { zodFunction } from '../interfaces/zodFunction' // update path as needed

export const runLLM = async ({
  messages,
  tools,
}: {
  messages: AIMessage[]
  tools: {
    name: string
    description: string
    parameters: any // should be a Zod object
  }[]
}) => {
  const formattedTools = tools.map((tool) =>
    zodFunction(tool.parameters, {
      name: tool.name,
      description: tool.description,
    })
  )

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
