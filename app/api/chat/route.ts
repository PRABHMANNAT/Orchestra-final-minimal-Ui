import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "edge"

type ClientMessage = {
  role: "user" | "assistant" | "system"
  content: string
}

export async function POST(req: Request) {
  const body = await req.json()
  const messages: ClientMessage[] = body.messages ?? []

  if (!process.env.OPENAI_API_KEY) {
    return new Response("OPENAI_API_KEY missing on server.", { status: 500 })
  }

  const result = streamText({
    model: openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini"),
    system:
      "You are Orchestra, an internal context layer for an engineering team. Answer in 2–4 short paragraphs. Be direct, cite concrete decisions or people when possible, and never invent sources.",
    messages,
  })

  return result.toTextStreamResponse()
}
