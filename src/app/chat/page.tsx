'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { runAgent } from '@/lib/core/agent'
import { z } from 'zod'
import { calendarTool, weatherTool } from '@/lib/tools/toolDefinitions'

// Message types for UI
type MessageRole = 'user' | 'assistant' | 'tool'

interface DisplayMessage {
  role: MessageRole
  content: string
  id: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    // Add user message to the chat UI
    const userDisplayMessage: DisplayMessage = {
      role: 'user',
      content: userMessage,
      id: `user-${Date.now().toString()}`,
    }

    setMessages((prev) => [...prev, userDisplayMessage])
    setLoading(true)

    try {
      // UI callbacks for the agent
      const uiCallbacks = {
        logMessage: (message: any) => {
          console.log('Agent message:', message)
        },
        createLoader: (text: string) => {
          console.log('Loading:', text)
          return {
            stop: () => {
              console.log('Loader stopped')
            },
            succeed: () => {
              console.log('Loader succeeded')
            },
            fail: () => {
              console.log('Loader failed')
            },
            update: (newText: string) => {
              console.log('Loader update:', newText)
            },
          }
        },
      }

      // Run the agent with user message
      const response = await runAgent({
        userMessage,
        tools: [weatherTool, calendarTool],
        uiCallbacks,
      })

      // Process agent responses for display
      // Skip the first message (user message) as we've already added it
      const newMessages = response.slice(1).map((msg) => ({
        role: msg.role as MessageRole,
        content: msg.content || 'No content provided',
        id: Date.now() + Math.random().toString(),
      }))

      setMessages((prev) => [...prev, ...newMessages])
    } catch (error) {
      console.error('Error running agent:', error)
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your request.',
          id: Date.now().toString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }
}
