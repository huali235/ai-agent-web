'use client'

type Highlight = {
  text: string
  title: string
  author: string
  image_url?: string | null
  note?: string | null
  id?: number
}

interface ReadwiseHighlightsProps {
  highlights: Highlight[]
}

export default function ReadwiseHighlights({
  highlights,
}: ReadwiseHighlightsProps) {
  if (!highlights || highlights.length === 0) {
    return <div className="p-4">No highlights available today.</div>
  }
  console.log('I got here!')
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📚 Daily Readwise Review</h2>
      <div className="space-y-6">
        {highlights.map((h, index) => (
          <div
            key={h.id || index}
            className="flex items-start gap-4 border-b pb-6"
          >
            {h.image_url && (
              <img
                src={h.image_url}
                alt={h.title}
                className="w-24 h-32 object-cover rounded shadow"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold">{h.title}</h3>
              <p className="text-sm text-gray-600 italic">by {h.author}</p>
              {h.note && (
                <p className="text-sm mt-1 text-gray-500">
                  <strong>Note:</strong> {h.note}
                </p>
              )}
              <blockquote className="mt-2 border-l-4 border-blue-500 pl-4 text-gray-800">
                "{h.text}"
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
