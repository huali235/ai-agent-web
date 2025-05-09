import { z } from 'zod'

export const weatherTool = {
  name: 'get_weather',
  description: `
      Use this tool when a user asks about weather information. Detect the timeframe the user is interested in:
      - For current conditions: When they use terms like "now", "currently", "today", "right now", "at the moment"
      - For hourly forecast: When they use terms like "hourly", "hour by hour", "next few hours", "throughout the day"
      - For daily/weekly forecast: When they use terms like "week", "weekly", "forecast", "next few days", "daily"
      
      If no timeframe is specified, default to current weather.
      
      Do not describe what you're doing, just perform the action and show the results directly to the user.
    `,
  parameters: z.object({
    location: z
      .string()
      .describe(
        'The city, region, or country to get weather for. For example: "London, GB", "New York", "Tokyo", etc.'
      ),
    type: z
      .enum(['current', 'hourly', 'daily'])
      .describe(
        'The type of weather information to retrieve. Options are "current", "hourly", or "daily". If not specified, defaults to "current".'
      )
      .default('current'),
  }),
}

export const calendarTool = {
  name: 'get_calendar_events',
  description: `
      Use this tool when a user asks about their calendar events. Detect the date the user is interested in:
      - For today: When they use terms like "today", "now", "this day"
      - For tomorrow: When they use terms like "tomorrow", "next day", "the day after"
      - For a specific date: When they mention a specific date like "next Friday", "March 15", "next week"
      - For a date range: When they mention a range like "next week", "this month", "next month"
  
      If no date is specified, default to today's events.
  
      Do not describe what you're doing, just perform the action and show the results directly to the user.
    `,
  parameters: z.object({
    date: z
      .string()
      .describe(
        "Date to look up events for. Format as YYYY-MM-DD, 'today', or 'tomorrow'"
      ),
  }),
}

export const readwiseTool = {
  name: 'get_readwise_highlights',
  description: `
    Fetch the user's current Readwise daily review. Use this tool when a user asks for their highlights, daily review, 
    or recent saved content from Readwise. Present the results in a readable format that shows the highlighted text, 
    source information, and any notes.
  `,
  parameters: z.object({}), // No parameters needed as the API only returns the current daily review
}
