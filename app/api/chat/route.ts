import { openai } from "@ai-sdk/openai"
import { streamText, convertToModelMessages } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const body = await req.json()
  const messages = body.messages ?? []

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o"),
    system:
      "You are a helpful assistant for an engineering team. Answer questions concisely and clearly.",
    messages: convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
