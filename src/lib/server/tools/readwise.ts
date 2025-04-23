export const getReadwiseHighlights = async () => {
  try {
    const response = await fetch('https://readwise.io/api/v2/review/', {
      method: 'GET',
      headers: {
        Authorization: `Token ${process.env.READWISE_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()

    // Format the response for better readability
    return {
      reviewId: data.review_id,
      reviewUrl: data.review_url,
      isCompleted: data.review_completed,
      highlights: data.highlights.map((highlight: any) => ({
        text: highlight.text,
        title: highlight.title,
        author: highlight.author,
        sourceType: highlight.source_type,
        note: highlight.note || '',
        image_url: highlight.image_url,
        id: highlight.id,
      })),
    }
  } catch (error) {
    console.error('Error fetching data from Readwise API:', error)
    throw new Error('Failed to fetch Readwise daily review')
  }
}
