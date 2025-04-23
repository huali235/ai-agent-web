// components/chat/MessageBubble.tsx

import { AnimatedMessage } from './AnimatedMessage'
import ReadwiseHighlights from '../ReadwiseHighlights'

type Message = {
  role: 'user' | 'assistant' | 'tool'
  content: string
}

const MessageBubble = ({ message }: { message: Message }) => {
  // Helper function to help detect if content is Readwise data
  const isReadwiseContent = (content: any) => {
    return (
      content &&
      typeof content === 'object' &&
      'highlights' in content &&
      Array.isArray(content.highlights)
    )
  }
  const isUser = message.role === 'user'

  return (
    <div
      className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-md whitespace-pre-wrap transition-all duration-300 ${
        isUser
          ? 'bg-gray-200 text-black self-end ml-auto mr-2'
          : 'bg-white text-black self-start ml-2'
      }`}
    >
      <p className="text-[10px] font-medium text-gray-500 mb-1">
        {isUser ? 'You' : 'Assistant'}
      </p>
      {isUser ? (
        <p>{message.content}</p>
      ) : isReadwiseContent(message.content) ? (
        <ReadwiseHighlights highlights={message.content.highlights} />
      ) : (
        <AnimatedMessage message={message} />
      )}
    </div>
  )
}

export default MessageBubble
