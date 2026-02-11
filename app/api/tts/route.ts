import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { text, language } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        const endpoint = process.env.AZURE_SPEECH_ENDPOINT; // e.g. https://eastus.tts.speech.microsoft.com/cognitiveservices/v1
        const key = process.env.AZURE_SPEECH_KEY;
        const region = process.env.AZURE_SPEECH_REGION;

        if (!key || !region) {
            return NextResponse.json({ error: "Speech configuration missing" }, { status: 503 });
        }

        // Voice mapping (simplified)
        const voiceMap: Record<string, string> = {
            'en': 'en-KE-AsiliaNeural', // Kenyan English
            'sw': 'sw-KE-ZuriNeural',   // Swahili
            'fr': 'fr-FR-DeniseNeural',
            'default': 'en-KE-AsiliaNeural'
        };

        const voiceName = voiceMap[language] || voiceMap['default'];

        const ttsUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

        const ssml = `
        <speak version='1.0' xml:lang='${language || 'en-US'}'>
            <voice xml:lang='${language || 'en-US'}' xml:gender='Female' name='${voiceName}'>
                ${text}
            </voice>
        </speak>
    `;

        const response = await fetch(ttsUrl, {
            method: "POST",
            headers: {
                "Ocp-Apim-Subscription-Key": key,
                "Content-Type": "application/ssml+xml",
                "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
                "User-Agent": "FarmTwinApp"
            },
            body: ssml,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Azure TTS API Error:", response.status, errorText);
            return NextResponse.json({ error: "TTS failed" }, { status: 500 });
        }

        const arrayBuffer = await response.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": "audio/mpeg",
                "Content-Length": arrayBuffer.byteLength.toString(),
            },
        });

    } catch (error) {
        console.error("TTS API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
