import { type NextRequest, NextResponse } from "next/server"

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT!
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview"
const AZURE_KEY = process.env.AZURE_OPENAI_KEY!

const SYSTEM_PROMPT = `You are AgriVoice, a friendly and knowledgeable AI farming assistant for smallholder farmers in Kenya. 
You provide advice on:
- Crop management (planting, fertilizing, harvesting)
- Pest and disease control
- Weather-based recommendations
- Soil health and irrigation
- Market prices and best practices
- Team task assignment and farm collaboration

Keep responses concise, practical, and easy to understand. Use simple language suitable for farmers with varying literacy levels.
When relevant, consider local conditions in Kenya (climate, common crops like maize, beans, tomatoes, etc.).
Always be encouraging and supportive.

If the user shares information about a plant disease or pest from an image analysis, provide detailed advice on:
1. Confirmation of the disease/pest identification
2. Immediate actions to take
3. Treatment options (both organic and chemical)
4. Prevention measures for the future

If the user asks to assign tasks to team members (e.g., "Tell John to water the tomatoes"), acknowledge the request and let them know the task has been assigned. Be conversational and natural about task assignments.`

export async function POST(req: NextRequest) {
  try {
    const { messages, imageAnalysis } = await req.json()

    // Build messages array
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; text: string }) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      })),
    ]

    // If there's image analysis, add it to the last user message
    if (imageAnalysis) {
      const lastUserIdx = apiMessages.length - 1
      apiMessages[lastUserIdx].content =
        `[Image Analysis Results: ${imageAnalysis}]\n\nUser question: ${apiMessages[lastUserIdx].content}`
    }

    const url = `${AZURE_ENDPOINT}?api-version=${AZURE_API_VERSION}`

    console.log("[v0] Calling Azure API at:", url)

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": AZURE_KEY,
      },
      body: JSON.stringify({
        messages: apiMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    const responseText = await response.text()
    console.log("[v0] Azure API Response Status:", response.status)
    console.log("[v0] Azure API Response:", responseText.substring(0, 500))

    if (!response.ok) {
      console.error("[v0] Azure GPT Error:", response.status, responseText)
      return NextResponse.json(
        {
          error: "Failed to get AI response",
          message: "I apologize, I'm having trouble connecting right now. Please try again in a moment.",
        },
        { status: 500 },
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
    } catch {
      console.error("[v0] JSON Parse Error:", responseText)
      return NextResponse.json(
        {
          error: "Invalid response format",
          message: "I received an unexpected response. Please try again.",
        },
        { status: 500 },
      )
    }

    const aiMessage = data.choices?.[0]?.message?.content || "I apologize, I could not process your request."

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("[v0] Chat API Error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "Something went wrong. Please try again later.",
      },
      { status: 500 },
    )
  }
}
