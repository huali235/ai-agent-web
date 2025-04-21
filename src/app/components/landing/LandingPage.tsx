'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, CloudSun, Clock } from 'lucide-react'
import ChatInterface from '../chat/ChatInterface'

export default function LandingPage() {
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const suggestions = [
    {
      icon: <CloudSun className="w-5 h-5 text-white" />,
      title: 'Check the Weather',
      description: 'Get today’s local forecast',
      prompt: 'What’s the weather like today?',
    },
    {
      icon: <Calendar className="w-5 h-5 text-white" />,
      title: 'View My Calendar',
      description: 'See your upcoming events',
      prompt: 'Show me my calendar for today.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-white" />,
      title: 'Ask Anything',
      description: 'I can help with any question',
      prompt: '',
    },
  ]

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-between bg-white px-4 py-6 relative">
      {/* History Icon */}
      <div className="absolute top-4 left-4">
        <button
          className="bg-gray-100 p-2 rounded-xl shadow border border-gray-200 hover:scale-105 transition"
          title="Chat History"
        >
          <Clock className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Greeting and Suggestions */}
      {!hasSubmitted && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-left mb-10 mt-30 mr-100"
          >
            <h1 className="text-3xl sm:text-4xl font-semibold bg-gradient-to-r from-[#005AA7] to-[#e3e1ca] text-transparent bg-clip-text">
              Hello Hussain
            </h1>
            <p className="text-3xl font-semibold text-gray-400 mt-2">
              How can I help you today?
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-12">
            {suggestions.map((sugg, i) => (
              <button
                key={i}
                className="p-4 rounded-2xl shadow hover:shadow-md transition flex flex-col items-start text-left bg-gradient-to-r from-[#005AA7] to-[#e3e1ca] text-white"
              >
                <div className="p-2 bg-white/20 rounded-md mb-2">
                  {sugg.icon}
                </div>
                <h3 className="font-semibold">{sugg.title}</h3>
                <p className="text-sm opacity-80">{sugg.description}</p>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Chat Interface */}
      <ChatInterface setHasSubmitted={setHasSubmitted} />
    </div>
  )
}
