import * as sdk from "microsoft-cognitiveservices-speech-sdk"

// Language mapping for Azure Speech Service
// Language mapping for Azure Speech Service
// Comprehensive list based on Azure Cognitive Services voice support
const LANGUAGE_MAP: Record<string, { speech: string; voice: string }> = {
  // --- African Languages ---
  af: { speech: "af-ZA", voice: "af-ZA-AdriNeural" }, // Afrikaans (South Africa)
  am: { speech: "am-ET", voice: "am-ET-MekdesNeural" }, // Amharic (Ethiopia)
  sw: { speech: "sw-KE", voice: "sw-KE-ZuriNeural" }, // Swahili (Kenya)
  sw_tz: { speech: "sw-TZ", voice: "sw-TZ-DaudiNeural" }, // Swahili (Tanzania)
  so: { speech: "so-SO", voice: "so-SO-UbaxNeural" }, // Somali (Somalia)
  zu: { speech: "zu-ZA", voice: "zu-ZA-ThandoNeural" }, // Zulu (South Africa)
  xh: { speech: "xh-ZA", voice: "xh-ZA-AmahleNeural" }, // Xhosa (South Africa)
  yo: { speech: "yo-NG", voice: "yo-NG-BolajiNeural" }, // Yoruba (Nigeria)
  ig: { speech: "ig-NG", voice: "ig-NG-EzichiNeural" }, // Igbo (Nigeria)
  ha: { speech: "ha-NG", voice: "ha-NG-AminaNeural" }, // Hausa (Nigeria)
  rw: { speech: "rw-RW", voice: "rw-RW-SapientiaNeural" }, // Kinyarwanda (Rwanda)
  st: { speech: "st-ZA", voice: "st-ZA-MphoNeural" }, // Sesotho (South Africa)
  ts: { speech: "ts-ZA", voice: "ts-ZA-BlessingNeural" }, // Tsonga (South Africa)
  tn: { speech: "tn-ZA", voice: "tn-ZA-BoitumeloNeural" }, // Tswana (South Africa)
  wo: { speech: "wo-SN", voice: "wo-SN-FatouNeural" }, // Wolof (Senegal) - often preview
  sn: { speech: "sn-ZW", voice: "sn-ZW-ToxicNeural" }, // Shona (Zimbabwe) - hypothetical/preview, fallback to machine if needed. Azure *does* support Shona now.
  ti: { speech: "ti-ET", voice: "ti-ET-ReeyatNeural" }, // Tigrinya (Ethiopia)
  ln: { speech: "ln-CD", voice: "ln-CD-MwambaNeural" }, // Lingala (DRC) - recent/preview
  luo: { speech: "luo-KE", voice: "sw-KE-ZuriNeural" }, // Luo (Kenya) - Not fully supported. Fallback to Swahili voice often used, or en. Sticking to Swahili fallback for now as per previous map.
  ki: { speech: "ki-KE", voice: "sw-KE-ZuriNeural" }, // Kikuyu (Kenya) - Not fully supported. Fallback to Swahili.

  // --- Major World Languages ---
  en: { speech: "en-US", voice: "en-US-AvaNeural" }, // English (US)
  en_uk: { speech: "en-GB", voice: "en-GB-SoniaNeural" }, // English (UK)
  en_ke: { speech: "en-KE", voice: "en-KE-AsiliaNeural" }, // English (Kenya)
  en_ng: { speech: "en-NG", voice: "en-NG-EzinneNeural" }, // English (Nigeria)
  fr: { speech: "fr-FR", voice: "fr-FR-DeniseNeural" }, // French (France)
  es: { speech: "es-ES", voice: "es-ES-ElviraNeural" }, // Spanish (Spain)
  de: { speech: "de-DE", voice: "de-DE-KatjaNeural" }, // German (Germany)
  it: { speech: "it-IT", voice: "it-IT-ElsaNeural" }, // Italian (Italy)
  pt: { speech: "pt-BR", voice: "pt-BR-FranciscaNeural" }, // Portuguese (Brazil)
  zh: { speech: "zh-CN", voice: "zh-CN-XiaoxiaoNeural" }, // Chinese (Mandarin)
  ja: { speech: "ja-JP", voice: "ja-JP-NanamiNeural" }, // Japanese
  ko: { speech: "ko-KR", voice: "ko-KR-SunHiNeural" }, // Korean
  hi: { speech: "hi-IN", voice: "hi-IN-SwaraNeural" }, // Hindi (India)
  ar: { speech: "ar-SA", voice: "ar-SA-ZariyahNeural" }, // Arabic (Saudi Arabia)
  ar_eg: { speech: "ar-EG", voice: "ar-EG-SalmaNeural" }, // Arabic (Egypt)
  ar_dz: { speech: "ar-DZ", voice: "ar-DZ-AminaNeural" }, // Arabic (Algeria)
  ar_ma: { speech: "ar-MA", voice: "ar-MA-MounaNeural" }, // Arabic (Morocco)
  ru: { speech: "ru-RU", voice: "ru-RU-SvetlanaNeural" }, // Russian
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

// Simple in-module last-spoken guard to avoid duplicate TTS calls in quick succession
let _lastSpoken: { text: string; ts: number } | null = null

export async function speakText(text: string, language = "en"): Promise<void> {
  const normalized = (text || "").trim()
  const now = Date.now()

  // If the same text was spoken very recently, skip to avoid duplicate voices
  if (_lastSpoken && _lastSpoken.text === normalized && (now - _lastSpoken.ts) < 2000) {
    console.log(`[speech] Skipping duplicate speak for text (within 2s): ${normalized.slice(0, 80)}`)
    return Promise.resolve()
  }

  _lastSpoken = { text: normalized, ts: now }

  console.log(`[speech] speakText START (${new Date(now).toISOString()}):`, normalized.slice(0, 120))

  try {
    // Try Azure TTS first via API
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
    });

    if (response.ok) {
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      return new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          console.log(`[speech] speakText END (api/tts) (${new Date().toISOString()})`)
          resolve()
        };
        audio.onerror = (e) => {
          console.error(`[speech] speakText error (api/tts):`, e)
          reject(e)
        };
        audio.play();
      });
    }
  } catch (e) {
    console.warn("[speech] Azure TTS failed via /api/tts, falling back to browser:", e);
  }

  // Fallback to Browser Speech Synthesis
  return new Promise<void>((resolve, reject) => {
    if (!('speechSynthesis' in window)) {
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
    utterance.lang = langSettings.speech
    utterance.rate = 0.9

    utterance.onend = () => {
      console.log(`[speech] speakText END (browser) (${new Date().toISOString()})`)
      resolve()
    };
    utterance.onerror = (error) => {
      console.error(`[speech] speakText error (browser):`, error)
      reject(error)
    };

    window.speechSynthesis.speak(utterance);
  });
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

// Browser-based continuous recognition
function startBrowserContinuousRecognition(
  onResult: (text: string, language: string) => void,
  onError: (error: string) => void,
  onListening: (isListening: boolean) => void,
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
  recognition.continuous = true
  recognition.interimResults = false
  recognition.maxAlternatives = 1

  recognition.onstart = () => {
    onListening(true)
  }

  recognition.onend = () => {
    onListening(false)
  }

  recognition.onresult = (event: any) => {
    const last = event.results.length - 1
    const transcript = event.results[last][0].transcript
    if (transcript.trim()) {
      onResult(transcript, language)
    }
  }

  recognition.onerror = (event: any) => {
    if (event.error !== 'no-speech') {
      onError(event.error)
    }
  }

  try {
    recognition.start()
  } catch (error) {
    onError("Could not start recognition")
  }

  return {
    stop: () => {
      try {
        recognition.stop()
      } catch (e) {
        console.error("Error stopping recognition:", e)
      }
    },
  }
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

export async function startContinuousRecognition(
  onResult: (text: string, language: string) => void,
  onError: (error: string) => void,
  onListening: (isListening: boolean) => void,
  language = "en",
): Promise<{ stop: () => void } | null> {
  try {
    const config = await getSpeechConfig()
    if (!config) {
      // Fallback to browser continuous recognition
      return startBrowserContinuousRecognition(onResult, onError, onListening, language)
    }

    const speechConfig = sdk.SpeechConfig.fromAuthorizationToken(config.token, config.region)
    const langSettings = LANGUAGE_MAP[language] || LANGUAGE_MAP.en
    speechConfig.speechRecognitionLanguage = langSettings.speech

    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

    recognizer.sessionStarted = () => {
      onListening(true)
    }

    recognizer.sessionStopped = () => {
      onListening(false)
    }

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech && e.result.text) {
        onResult(e.result.text, language)
      }
    }

    recognizer.canceled = (s, e) => {
      if (e.reason === sdk.CancellationReason.Error) {
        onError(e.errorDetails)
      }
      recognizer.stopContinuousRecognitionAsync()
      onListening(false)
    }

    recognizer.startContinuousRecognitionAsync(
      () => {
        onListening(true)
      },
      (error) => {
        onError(error)
        onListening(false)
      },
    )

    return {
      stop: () => {
        recognizer.stopContinuousRecognitionAsync(
          () => {
            recognizer.close()
            onListening(false)
          },
          (error) => {
            console.error("Error stopping recognition:", error)
            recognizer.close()
            onListening(false)
          },
        )
      },
    }
  } catch (error) {
    return startBrowserContinuousRecognition(onResult, onError, onListening, language)
  }
}
