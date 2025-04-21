'use client'

import { useState, FormEvent, useRef, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

// Message types for UI
type MessageRole = 'user' | 'assistant' | 'tool'

interface DisplayMessage {
  role: MessageRole
  content: string
  id: string
}

export default function ChatInterface() {
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

    console.log('input before creating message:', userMessage)
    // Add user message to the chat UI
    const userDisplayMessage: DisplayMessage = {
      role: 'user',
      content: userMessage,
      id: uuid(),
    }
    console.log('user message:', userDisplayMessage)

    setMessages((prev) => {
      const updatedMessages = [...prev, userDisplayMessage]
      console.log('updated message:', updatedMessages)
      sendMessageToApi(updatedMessages)
      return updatedMessages
    })
    setLoading(true)

    async function sendMessageToApi(updatedMessages: DisplayMessage[]) {
      try {
        console.log('Sending messages to API:', updatedMessages)
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const data = await response.json()
        console.log('Response from API:', data)

        if (data.messages && Array.isArray(data.messages)) {
          setMessages(data.messages)
        } else {
          console.error('Unexpected response format:', data)
        }
      } catch (error) {
        console.error('Error sending message:', error)
      } finally {
        setLoading(false)
      }
    }
  }
  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            Send a message to start a conversation
          </div>
        ) : (
          messages
            .filter(
              (message) => message.role !== 'tool' && message.content !== 'null'
            )
            .map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-100 ml-12'
                    : 'bg-green-100 mr-12'
                }`}
              >
                <p className="text-xs font-semibold mb-1">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </p>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))
        )}
        {loading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-12 animate-pulse">
            <p className="text-xs font-semibold mb-1">Assistant</p>
            <p>Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          disabled={loading}
        />
        <button
          type="submit"
          className={`p-2 bg-blue-500 text-white rounded-r-lg ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  )
}
