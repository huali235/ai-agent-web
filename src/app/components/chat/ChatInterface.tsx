'use client'

import { ArrowUp } from 'lucide-react'
import { useState, FormEvent, useRef, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

type MessageRole = 'user' | 'assistant' | 'tool'

interface DisplayMessage {
  role: MessageRole
  content: string
  id: string
}

interface ChatInterfaceProps {
  setHasSubmitted: (value: boolean) => void
}

export default function ChatInterface({ setHasSubmitted }: ChatInterfaceProps) {
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

    setHasSubmitted(true) // 👈 Hides greeting/suggestions on first submit

    const userMessage = input.trim()
    setInput('')

    const userDisplayMessage: DisplayMessage = {
      role: 'user',
      content: userMessage,
      id: uuid(),
    }

    setMessages((prev) => {
      const updatedMessages = [...prev, userDisplayMessage]
      sendMessageToApi(updatedMessages)
      return updatedMessages
    })
    setLoading(true)

    async function sendMessageToApi(updatedMessages: DisplayMessage[]) {
      try {
        const response = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: updatedMessages }),
        })

        if (!response.ok) throw new Error('Failed to send message')

        const data = await response.json()

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
    <div className="w-full max-w-3xl flex flex-col flex-1 justify-end mt-4">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[60vh]">
        {messages.map((message) => (
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
        ))}
        {loading && (
          <div className="bg-gray-100 p-4 rounded-lg mr-12 animate-pulse">
            <p className="text-xs font-semibold mb-1">Assistant</p>
            <p>Thinking...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}

      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl mb-20 ml-20"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="w-full py-3 px-4 pr-12 rounded-full border border-gray-300 focus:outline-none  bg-white/70 backdrop-blur-md text-gray-800"
          disabled={loading}
        />
        <button
          type="submit"
          className={`absolute top-1/2 right-3 -translate-y-1/2 bg-black  text-white p-2 rounded-full shadow-md transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={handleSubmit}
          disabled={loading}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>
      {/*}
      <form
        onSubmit={handleSubmit}
        className="relative w-full max-w-xl mt-4 mb-20"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
          className="w-full p-3 pr-12 rounded-full border border-gray-300 focus:outline-none  bg-white/70 backdrop-blur-md text-gray-800 mb-20"
          disabled={loading}
        />
        <button
          type="submit"
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white bg-black p-2 rounded-full shadow transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={loading}
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      </form>
      */}
    </div>
  )
}
