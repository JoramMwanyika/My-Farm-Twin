
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: ".env.local" });

async function fetchVoices() {
    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION || "eastus";

    if (!speechKey) {
        console.error("AZURE_SPEECH_KEY not found in .env.local");
        // Fallback: try reading .env.local manually if dotenv failed
        try {
            const envContent = fs.readFileSync(".env.local", "utf8");
            const match = envContent.match(/AZURE_SPEECH_KEY=(.*)/);
            if (match) {
                process.env.AZURE_SPEECH_KEY = match[1].trim();
                console.log("Loaded key manually");
            }
        } catch (e) {
            console.error("Could not read .env.local manually");
        }
    }

    // Check again
    if (!process.env.AZURE_SPEECH_KEY) {
        console.error("Still no key. Exiting.");
        process.exit(1);
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(process.env.AZURE_SPEECH_KEY, speechRegion);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, null); // null for audio config to avoid default speaker

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
                voiceType: v.voiceType
            }));

            // Save to file
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
