import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET(req: Request) {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch the most recent chat session
        const chatSession = await db.chatSession.findFirst({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!chatSession) {
            return NextResponse.json({ messages: [] });
        }

        // Map DB messages to UI format
        const formattedMessages = chatSession.messages.map(msg => ({
            id: msg.id,
            role: msg.role === 'assistant' ? 'ai' : 'user', // Map DB 'assistant' to UI 'ai'
            text: msg.content,
            // formattedTime: msg.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        return NextResponse.json({ messages: formattedMessages });

    } catch (error) {
        console.error("Chat History Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
