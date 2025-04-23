import { useEffect, useState } from 'react'

export function AnimatedMessage({
  message,
}: {
  message: { role: string; content: string }
}) {
  const [displayedText, setDisplayedText] = useState('')
  const TYPING_SPEED = 30 // Increased from 10 to 40ms for slower reveal

  useEffect(() => {
    // Reset displayed text when message changes
    setDisplayedText(message.role === 'assistant' ? '' : message.content)

    // Only animate assistant messages
    if (message.role !== 'assistant') return
    if (!message.content) return // Handle empty content

    let i = 0
    const interval = setInterval(() => {
      if (i < message.content.length) {
        setDisplayedText(message.content.substring(0, i + 1))
        i++
      } else {
        clearInterval(interval)
      }
    }, TYPING_SPEED)

    // Cleanup on unmount or when message changes
    return () => clearInterval(interval)
  }, [message.role, message.content]) // Properly track dependencies

  return (
    <p>
      {displayedText}
      {message.role === 'assistant' &&
        displayedText.length < (message.content?.length || 0) && (
          <span className="animate-pulse">|</span>
        )}
    </p>
  )
}
