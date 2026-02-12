
import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

async function fetchVoices() {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION || "eastus";

    if (!speechKey) {
        console.error("AZURE_SPEECH_KEY not found in .env.local");
        process.exit(1);
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(speechKey, speechRegion);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    console.log(`Fetching voices for region: ${speechRegion}...`);

    try {
        const result = await synthesizer.getVoicesAsync();

        if (result.reason === sdk.ResultReason.VoicesListRetrieved) {
            console.log(`Initial voices count: ${result.voices.length}`);

            const voices = result.voices.map(v => ({
                name: v.name,
                shortName: v.shortName,
                gender: v.gender,
                locale: v.locale,
                localName: v.localName,
                styleList: v.styleList,
                voiceType: v.voiceType
            }));

            // Filter for Neural voices as they are better
            const neuralVoices = voices.filter(v => v.voiceType === sdk.VoiceType.Neural); // Check enum or string? SDK usually uses Enums but here mapped to object.
            // Actually result.voices is array of VoiceInfo. 
            // voiceType is likely a number (enum) in SDK but might be exposed as string in JS?
            // Let's just save all and inspect JSON.

            console.log(`Found ${voices.length} voices.`);
            fs.writeFileSync("voices.json", JSON.stringify(voices, null, 2));
            console.log("Saved to voices.json");
        } else {
            console.error("Failed to retrieve voices:", result.errorDetails);
        }
    } catch (error) {
        console.error("Error fetching voices:", error);
    } finally {
        synthesizer.close();
    }
}

fetchVoices();
