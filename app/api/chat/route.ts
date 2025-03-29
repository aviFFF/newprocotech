import { StreamingTextResponse } from "ai"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

// IMPORTANT: Set the runtime to edge
export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // Generate a response using the AI SDK
  const response = await generateText({
    model: openai("gpt-4o"),
    messages,
    system:
      "You are a helpful assistant for a software development company called DevGenius. You can help with information about our courses, services, and general programming questions. Be friendly, professional, and concise.",
  })

  // Return the response as a streaming response
  return new StreamingTextResponse(response.toReadableStream())
}

