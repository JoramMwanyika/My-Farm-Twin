import * as sdk from "microsoft-cognitiveservices-speech-sdk"

// Language mapping for Azure Speech Service
const LANGUAGE_MAP: Record<string, { speech: string; voice: string }> = {
  en: { speech: "en-US", voice: "en-US-AvaNeural" },
  sw: { speech: "sw-KE", voice: "sw-KE-ZuriNeural" },
  fr: { speech: "fr-FR", voice: "fr-FR-DeniseNeural" },
}

// Get Speech SDK token and region from API
async function getSpeechConfig(): Promise<{ token: string; region: string } | null> {
  try {
    const response = await fetch("/api/speech/token")
    if (!response.ok) {
      console.error("Failed to get speech token")
      return null
    }
    return await response.json()
  } catch (error) {
    console.error("Error getting speech token:", error)
    return null
  }
}

export async function speakText(text: string, language = "en"): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const config = await getSpeechConfig()
      if (!config) {
        // Fallback to browser speech synthesis
        return speakTextBrowser(text, language)
      }

      const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config.token, config.region)
      const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
      speechConfig.speechSynthesisVoiceName = langSettings.voice

      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()
      const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig)

      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            synthesizer.close()
            resolve()
          } else {
            synthesizer.close()
            reject(new Error("Speech synthesis failed"))
          }
        },
        (error) => {
          synthesizer.close()
          reject(error)
        },
      )
    } catch (error) {
      // Fallback to browser speech synthesis
      await speakTextBrowser(text, language)
      resolve()
    }
  })
}

// Fallback browser-based speech synthesis
function speakTextBrowser(text: string, language = "en"): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!("speechSynthesis" in window)) {
      reject(new Error("Speech synthesis not supported"))
      return
    }

    const utterance = new SpeechSynthesisUtterance(text)
    const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
    utterance.lang = langSettings.speech
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onend = () => resolve()
    utterance.onerror = (e) => reject(e)

    window.speechSynthesis.speak(utterance)
  })
}

export async function startSpeechRecognition(
  onResult: (text: string, language: string) => void,
  onError: (error: string) => void,
  language = "en",
): Promise<{ stop: () => void } | null> {
  try {
    const config = await getSpeechConfig()
    if (!config) {
      // Fallback to browser speech recognition
      return startBrowserRecognition(onResult, onError, language)
    }

    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config.token, config.region)
    const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
    speechConfig.speechRecognitionLanguage = langSettings.speech

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    recognizer.recognizeOnceAsync(
      (result) => {
        if (result.reason === sdk.ResultReason.RecognizedSpeech) {
          onResult(result.text, language)
        } else if (result.reason === sdk.ResultReason.NoMatch) {
          onError("No speech could be recognized")
        } else {
          onError("Recognition failed")
        }
        recognizer.close()
      },
      (error) => {
        onError(error)
        recognizer.close()
      },
    )

    return {
      stop: () => recognizer.close(),
    }
  } catch (error) {
    // Fallback to browser recognition
    return startBrowserRecognition(onResult, onError, language)
  }
}

// Fallback browser-based speech recognition
function startBrowserRecognition(
  onResult: (text: string, language: string) => void,
  onError: (error: string) => void,
  language = "en",
): { stop: () => void } | null {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

  if (!SpeechRecognition) {
    onError("Speech recognition not supported in this browser")
    return null
  }

  const recognition = new SpeechRecognition()
  const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en

  recognition.lang = langSettings.speech
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript, language)
  }

  recognition.onerror = (event: any) => {
    onError(event.error)
  }

  recognition.start()

  return {
    stop: () => recognition.stop(),
  }
}
