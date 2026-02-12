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

        console.log(`[TTS API] Request for text: "${text.substring(0, 20)}...", language: ${language}`);

        // Voice mapping - aligned with lib/speech.ts
        const voiceMap: Record<string, string> = {
            // African Languages
            'af': 'af-ZA-AdriNeural',
            'am': 'am-ET-MekdesNeural',
            'sw': 'sw-KE-ZuriNeural',
            'sw_tz': 'sw-TZ-DaudiNeural',
            'so': 'so-SO-UbaxNeural',
            'zu': 'zu-ZA-ThandoNeural',
            'xh': 'xh-ZA-AmahleNeural',
            'yo': 'yo-NG-BolajiNeural',
            'ig': 'ig-NG-EzichiNeural',
            'ha': 'ha-NG-AminaNeural',
            'rw': 'rw-RW-SapientiaNeural',
            'st': 'st-ZA-MphoNeural',
            'ts': 'ts-ZA-BlessingNeural',
            'tn': 'tn-ZA-BoitumeloNeural',
            'wo': 'wo-SN-FatouNeural',
            'sn': 'sn-ZW-ToxicNeural',
            'ti': 'ti-ET-ReeyatNeural',
            'ln': 'ln-CD-MwambaNeural',
            'luo': 'sw-KE-ZuriNeural', // Fallback
            'ki': 'sw-KE-ZuriNeural',  // Fallback
            'en_ke': 'en-KE-AsiliaNeural',
            'en_ng': 'en-NG-EzinneNeural',

            // International
            'en': 'en-US-AvaNeural',
            'en_uk': 'en-GB-SoniaNeural',
            'fr': 'fr-FR-DeniseNeural',
            'es': 'es-ES-ElviraNeural',
            'de': 'de-DE-KatjaNeural',
            'it': 'it-IT-ElsaNeural',
            'pt': 'pt-BR-FranciscaNeural',
            'zh': 'zh-CN-XiaoxiaoNeural',
            'ja': 'ja-JP-NanamiNeural',
            'ko': 'ko-KR-SunHiNeural',
            'hi': 'hi-IN-SwaraNeural',
            'ar': 'ar-SA-ZariyahNeural',
            'ar-EG': 'ar-EG-SalmaNeural',
            'ar-DZ': 'ar-DZ-AminaNeural',
            'ar-MA': 'ar-MA-MounaNeural',
            'ru': 'ru-RU-SvetlanaNeural',
        };

        const targetVoice = voiceMap[language] || voiceMap['en'];
        console.log(`[TTS API] Selected voice: ${targetVoice} for language: ${language}`);
        // Extract locale from voice name (e.g. "af-ZA" from "af-ZA-AdriNeural")
        // This is safer than relying on the incoming 'language' code which might be short (e.g. 'sw')
        // while SSML expects full locale (e.g. 'sw-KE') for that voice.
        const targetLocale = targetVoice.split('-').slice(0, 2).join('-');

        const ttsUrl = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

        const ssml = `
        <speak version='1.0' xml:lang='${targetLocale}'>
            <voice xml:lang='${targetLocale}' xml:gender='Female' name='${targetVoice}'>
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
