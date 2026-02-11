import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].text;

    // 1. Fetch User Context (Farm Data)
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      include: {
        farms: {
          include: {
            blocks: {
              include: {
                readings: {
                  orderBy: { createdAt: 'desc' },
                  take: 1
                }
              }
            }
          }
        }
      }
    });

    if (!user || user.farms.length === 0) {
      return NextResponse.json({
        message: "I see you haven't set up a farm yet. Please go to the Setup page to create your digital twin first!"
      });
    }

    const farm = user.farms[0];
    const blockDetails = farm.blocks.map(b => {
      const reading = b.readings[0];
      const status = reading ? reading.healthStatus : "no data";
      const moisture = reading ? `${reading.moisture}%` : "unknown";
      return `- ${b.name}: Status=${status}, Moisture=${moisture}`;
    }).join("\n");

    const systemPrompt = `You are AgriTwin, an expert AI farming assistant for ${user.name || 'the farmer'}.
    
Current Farm Context:
- Farm Name: ${farm.name}
- Location: ${farm.location || 'Unknown'} (Assume typical climate for this detailed location)
- Farm Size: ${farm.size || 'Unknown'} acres
- Blocks & Status:
${blockDetails}

Instructions:
- Provide specific, actionable advice based on the farm data.
- If moisture is low (<30%), suggest watering.
- If health is critical, suggest immediate inspection.
- Keep responses concise and helpful. 
- Use the user's name: ${user.name?.split(' ')[0] || 'Farmer'}.
- Start with "Jambo" if appropriate.`;

    // 2. PERSISTENCE: Find or Create Chat Session
    let chatSession = await db.chatSession.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' }
    });

    if (!chatSession) {
      chatSession = await db.chatSession.create({
        data: {
          userId: user.id,
          title: "Advisor Chat",
        }
      });
    }

    // Save User Message
    await db.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "user",
        content: lastMessage,
      }
    });

    // 3. Call Azure OpenAI
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const key = process.env.AZURE_OPENAI_KEY;
    const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4";

    let aiReply = "I'm having trouble connecting to my AI brain right now.";

    if (!endpoint || !key) {
      console.warn("Azure OpenAI keys missing, using fallback.");
      aiReply = "Azure keys are missing. Please check your configuration.";
    } else {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": key,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: systemPrompt },
            ...messages.map((m: any) => ({
              role: m.role === 'ai' ? 'assistant' : m.role,
              content: m.text
            }))
          ],
          max_tokens: 800,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Azure OpenAI API Error:", response.status, errorText);
        aiReply = "I'm sorry, I'm having trouble connecting right now. Please try again later.";
      } else {
        const data = await response.json();
        aiReply = data.choices[0].message.content;
      }
    }

    // 4. Save AI Response
    await db.chatMessage.create({
      data: {
        sessionId: chatSession.id,
        role: "assistant",
        content: aiReply,
      }
    });

    return NextResponse.json({ message: aiReply });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
