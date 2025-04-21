import { ZodObject } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

export function zodFunction(
  schema: ZodObject<any>,
  config: { name: string; description: string }
) {
  const jsonSchema = zodToJsonSchema(schema)
  return {
    type: 'function',
    function: {
      name: config.name,
      description: config.description,
      parameters: jsonSchema,
    },
  }
}
