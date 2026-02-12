"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Send, Volume2, VolumeX, Globe, Loader2, Phone, PhoneOff, Image as ImageIcon, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { speakText, startSpeechRecognition, startContinuousRecognition } from "@/lib/speech"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"

type Message = {
  id: number
  role: "ai" | "user"
  text: string
  actions?: string[]
  image?: string
  analysis?: {
    condition: string
    severity: string
    symptoms: string[]
    plantType: string
    confidence: string
  }
}

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "ki", name: "Gikuyu", flag: "🇰🇪" },
  { code: "luo", name: "Dholuo", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

const GREETINGS: Record<string, string> = {
  en: "Hello! I'm ready to talk.",
  sw: "Habari",
  ki: "Wimwega! Ndi tayari kwaria.",
  luo: "Misawa! Antie tayari wuoyo.",
  fr: "Bonjour! Je suis prêt à parler.",
}

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Jambo! I am AgriTwin, your AI farming assistant. How can I help you today? You can also take a photo of your crops to check for diseases!",
      actions: ["Check my crop health", "Weather advice", "Pest control tips", "Scan plant for disease"],
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [language, setLanguage] = useState("en")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
  const continuousRecognitionRef = useRef<{ stop: () => void } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isSpeakingInProgressRef = useRef(false)
  const recognitionPausedRef = useRef(false)
  const lastUserRequestRef = useRef<{ text: string; ts: number } | null>(null)
  const continuousOnResultRef = useRef<((text: string, language: string) => void | Promise<void>) | null>(null)
  const continuousOnErrorRef = useRef<((error: any) => void) | null>(null)
  const continuousOnListeningRef = useRef<((isListening: boolean) => void) | null>(null)
  const recognitionWasActiveRef = useRef(false)
  const aiSpeakLockRef = useRef<number>(0)

  // Start continuous recognition helper
  const startContinuousRecognizer = async () => {
    try {
      if (continuousRecognitionRef.current) {
        console.log("Continuous recognizer already running")
        return
      }

      continuousRecognitionRef.current = await startContinuousRecognition(
        continuousOnResultRef.current!,
        continuousOnErrorRef.current!,
        continuousOnListeningRef.current!,
        language,
      )
    } catch (err) {
      console.error("Failed to start continuous recognizer:", err)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const analyzeImage = async (
    file: File,
  ): Promise<{ analysis: Message["analysis"]; rawVision: { caption: string } } | null> => {
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to analyze image")
      }

      return await response.json()
    } catch (error) {
      console.error("Image analysis error:", error)
      return null
    }
  }

  const sendToAI = async (userText: string, imageAnalysisData?: string, autoSpeakResponse = false) => {
    const normalized = userText.trim().toLowerCase()
    const now = Date.now()
    if (lastUserRequestRef.current && lastUserRequestRef.current.text === normalized && (now - lastUserRequestRef.current.ts) < 5000) {
      return
    }

    lastUserRequestRef.current = { text: normalized, ts: now }

    if (isLoading) return

    setIsLoading(true)

    try {
      // DIRECT_LANGUAGES are handled directly by the AI (no separate translation step)
      const DIRECT_LANGUAGES = ["sw", "ki", "luo"]
      const useDirectGen = DIRECT_LANGUAGES.includes(language)

      // Translate to English if needed (and not using direct generation)
      let textToSend = userText
      if (language !== "en" && !useDirectGen) {
        const translateRes = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: userText, from: language, to: "en" }),
        })
        if (translateRes.ok) {
          const { translatedText } = await translateRes.json()
          textToSend = translatedText
        }
      }

      // Get AI response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.filter((m) => m.role === "user" || m.role === "ai").slice(-10),
            { role: "user", text: textToSend },
          ],
          imageAnalysis: imageAnalysisData,
          language: language, // Pass the target language to the API
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const fallbackMessage = data.message || "I'm having trouble connecting. Please try again."
        const aiMsg: Message = {
          id: Date.now() + 1,
          role: "ai",
          text: fallbackMessage,
        }
        setMessages((prev) => [...prev, aiMsg])
        return
      }

      const message = data.message

      // Translate response if needed (and not using direct generation)
      let finalMessage = message
      if (language !== "en" && !useDirectGen) {
        const translateRes = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: message, from: "en", to: language }),
        })
        if (translateRes.ok) {
          const { translatedText } = await translateRes.json()
          finalMessage = translatedText
        }
      }

      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: finalMessage,
      }
      setMessages((prev) => [...prev, aiMsg])

      const shouldSpeak = isVoiceMode ? true : (autoSpeak || autoSpeakResponse)

      if (shouldSpeak && !isSpeakingInProgressRef.current) {
        const now = Date.now()
        if (now - aiSpeakLockRef.current < 1000) {
          // Skip
        } else {
          aiSpeakLockRef.current = now
          isSpeakingInProgressRef.current = true

          try { window.speechSynthesis.cancel() } catch (e) { /** ignore */ }
          setIsSpeaking(false)

          await new Promise(resolve => setTimeout(resolve, 200))

          try {
            await handleSpeak(finalMessage)
          } catch (error) {
            console.error("Error in auto-speak:", error)
          } finally {
            isSpeakingInProgressRef.current = false
            aiSpeakLockRef.current = Date.now()
          }
        }
      }
    } catch (error) {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
      }
      setMessages((prev) => [...prev, aiMsg])
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        if (lastUserRequestRef.current && (Date.now() - lastUserRequestRef.current.ts) > 5000) {
          lastUserRequestRef.current = null
        }
      }, 5000)
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return

    const userText = inputValue.trim() || "Please analyze this image of my crop"

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      image: imagePreview || undefined,
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")

    let imageAnalysisData: string | undefined

    if (selectedImage) {
      setIsAnalyzing(true)
      toast.info("Analyzing image...")

      const result = await analyzeImage(selectedImage)
      setIsAnalyzing(false)

      if (result) {
        const { analysis, rawVision } = result

        const analysisMsg: Message = {
          id: Date.now() + 0.5,
          role: "ai",
          text: `I've analyzed your image. Here's what I found:`,
          analysis: analysis,
        }
        setMessages((prev) => [...prev, analysisMsg])

        if (analysis && rawVision) {
          imageAnalysisData = `Plant Type: ${analysis.plantType || "Unknown"}, Condition: ${analysis.condition || "Unknown"}, Severity: ${analysis.severity || "Unknown"}, Symptoms: ${analysis.symptoms?.join(", ") || "None detected"}, Image Description: ${rawVision.caption}`
        }
      } else {
        toast.error("Could not analyze the image.")
      }

      setSelectedImage(null)
      setImagePreview(null)
    }

    await sendToAI(userText, imageAnalysisData)
  }

  const handleActionClick = async (action: string) => {
    if (action === "Scan plant for disease") {
      fileInputRef.current?.click()
      return
    }

    const userMsg: Message = { id: Date.now(), role: "user", text: action }
    setMessages((prev) => [...prev, userMsg])
    await sendToAI(action)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large (max 10MB)")
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success("Image selected")
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      recognitionRef.current?.stop()
      setIsRecording(false)
    } else {
      setIsRecording(true)
      toast("Listening...", { description: `Speak in ${currentLang.name}` })

      recognitionRef.current = await startSpeechRecognition(
        async (text) => {
          setIsRecording(false)
          setInputValue(text)
        },
        () => {
          setIsRecording(false)
        },
        language,
      )
    }
  }

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      try { continuousRecognitionRef.current?.stop() } catch (e) { /**/ } finally { continuousRecognitionRef.current = null }
      setIsVoiceMode(false)
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      toast.info("Voice conversation ended")
    } else {
      setIsVoiceMode(true)
      toast.success("Voice conversation started")

      setIsSpeaking(true)
      try {
        const greeting = GREETINGS[language] || GREETINGS["en"]
        await speakText(greeting, language)
      } finally {
        setIsSpeaking(false)
      }

      continuousOnResultRef.current = async (text) => {
        if (recognitionPausedRef.current || isSpeaking || isLoading) return
        if (Date.now() - aiSpeakLockRef.current < 1500) return
        if (!text.trim()) return

        recognitionPausedRef.current = true
        try {
          const userMsg: Message = { id: Date.now(), role: "user", text }
          setMessages((prev) => [...prev, userMsg])
          await sendToAI(text, undefined, true)
        } finally {
          setTimeout(() => { recognitionPausedRef.current = false }, 300)
        }
      }

      continuousOnErrorRef.current = () => { /* quiet error */ }
      continuousOnListeningRef.current = () => { /* */ }
      await startContinuousRecognizer()
    }
  }

  const handleSpeak = async (text: string) => {
    window.speechSynthesis.cancel()
    if (isSpeaking && !isVoiceMode) {
      setIsSpeaking(false)
      return
    }

    const cleanText = text.replace(/[*_#`\[\]]/g, '')

    setIsSpeaking(true)
    try {
      if (isVoiceMode && continuousRecognitionRef.current) {
        try {
          recognitionWasActiveRef.current = true
          continuousRecognitionRef.current.stop()
          await new Promise((r) => setTimeout(r, 200))
        } catch (e) { /**/ } finally { continuousRecognitionRef.current = null }
      }

      recognitionPausedRef.current = true
      await speakText(cleanText, language)
    } catch (error) {
      // ignore
    } finally {
      setIsSpeaking(false)
      recognitionPausedRef.current = false

      if (isVoiceMode && recognitionWasActiveRef.current) {
        try {
          await startContinuousRecognizer()
        } catch (e) { /**/ } finally { recognitionWasActiveRef.current = false }
      }
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  return (
    <div className="flex flex-col h-screen bg-[#0f172a]">
      <Header title="AgriTwin Advisor" />

      {/* Top Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1e293b] border-b border-slate-700 shadow-sm z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-[#22c55e] hover:bg-slate-700">
              <Globe className="h-4 w-4" />
              <span className="font-medium">{currentLang.flag} {currentLang.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem key={lang.code} onClick={() => setLanguage(lang.code)}>
                <span className="text-lg mr-2">{lang.flag}</span> {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            size="sm"
            className={`gap-2 transition-all rounded-full ${isVoiceMode
              ? 'bg-red-500 hover:bg-red-600 text-white border-none animate-pulse'
              : 'border-slate-600 text-[#22c55e] hover:bg-slate-700'
              }`}
            onClick={toggleVoiceMode}
            disabled={isLoading}
          >
            {isVoiceMode ? <PhoneOff className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
            <span className="hidden sm:inline">{isVoiceMode ? 'End Call' : 'Voice Chat'}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={autoSpeak ? 'text-[#22c55e]' : 'text-slate-500'}
            onClick={() => setAutoSpeak(!autoSpeak)}
          >
            {autoSpeak ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32 scroll-smooth">
        <div className="flex justify-center">
          <span className="text-xs font-medium text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full border border-slate-700">
            Today • {new Date().toLocaleDateString()}
          </span>
        </div>

        <AnimatePresence mode="popLayout">
          {messages.map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {/* Avatar */}
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 shadow-sm
                    ${msg.role === "ai" ? "bg-[#1e293b] text-[#22c55e] border border-slate-700" : "bg-[#22c55e] text-[#0f172a]"}`}
              >
                {msg.role === "ai" ? <Sparkles className="h-4 w-4" /> : <span className="text-xs font-bold">ME</span>}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col max-w-[85%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`rounded-2xl px-5 py-3 shadow-sm text-sm leading-relaxed
                        ${msg.role === "ai"
                    ? "bg-[#1e293b] text-slate-200 rounded-tl-none border border-slate-700"
                    : "bg-[#22c55e] text-[#0f172a] font-medium rounded-tr-none shadow-lg shadow-green-900/10"}`}
                >
                  {msg.image && (
                    <div className="mb-3 rounded-lg overflow-hidden border border-white/20">
                      <Image src={msg.image} alt="Upload" width={200} height={150} className="w-full h-auto object-cover" />
                    </div>
                  )}

                  {msg.role === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-p:text-slate-300 prose-headings:text-slate-200 prose-strong:text-white prose-a:text-[#22c55e]">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                  ) : (
                    <p>{msg.text}</p>
                  )}

                  {/* Analysis Card */}
                  {msg.analysis && (
                    <div className="mt-4 bg-slate-800/50 rounded-xl p-3 border border-slate-700 w-full text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`h-2 w-2 rounded-full ${msg.analysis.severity.toLowerCase() === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                        <span className="font-bold text-slate-200 capitalize">{msg.analysis.plantType}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="bg-[#0f172a] p-2 rounded border border-slate-700">
                          <p className="text-slate-500">Condition</p>
                          <p className="font-medium text-slate-200">{msg.analysis.condition}</p>
                        </div>
                        <div className="bg-[#0f172a] p-2 rounded border border-slate-700">
                          <p className="text-slate-500">Confidence</p>
                          <p className="font-medium text-slate-200">{msg.analysis.confidence}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400">
                        <span className="font-medium">Symptoms:</span> {msg.analysis.symptoms.join(", ")}
                      </p>
                    </div>
                  )}
                </div>

                {/* Suggested Actions chips */}
                {msg.actions && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleActionClick(action)}
                        className="bg-slate-800 hover:bg-slate-700 text-[#22c55e] text-xs px-3 py-1.5 rounded-full transition-colors border border-slate-700 hover:border-[#22c55e]"
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-[#1e293b] flex items-center justify-center shrink-0 border border-slate-700">
              <Sparkles className="h-4 w-4 text-[#22c55e]" />
            </div>
            <div className="bg-[#1e293b] px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2 border border-slate-700">
              <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-[#22c55e] rounded-full animate-bounce [animation-delay:-0.3s]" />
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#1e293b] border-t border-slate-700 p-4 pb-24 z-20">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#0f172a] p-2 rounded-3xl border border-slate-700 focus-within:border-[#22c55e] focus-within:ring-1 focus-within:ring-[#22c55e] transition-all shadow-sm">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-slate-400 hover:text-[#22c55e] hover:bg-slate-800 h-10 w-10 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>

          <div className="flex-1 min-w-0">
            {imagePreview && (
              <div className="relative inline-block mb-2 ml-2">
                <Image src={imagePreview} alt="Preview" width={48} height={48} className="rounded-lg object-cover border border-slate-600" />
                <button onClick={() => { setSelectedImage(null); setImagePreview(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600">
                  <span className="sr-only">Remove</span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            )}

            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder={isRecording ? "Listening..." : "Ask anything about your farm..."}
              className="w-full bg-transparent border-none focus:ring-0 resize-none max-h-32 py-2.5 px-2 text-slate-200 placeholder:text-slate-500"
              rows={1}
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full h-10 w-10 shrink-0 transition-colors ${isRecording ? 'bg-red-500/10 text-red-500 animate-pulse' : 'text-slate-400 hover:text-[#22c55e] hover:bg-slate-800'}`}
            onClick={toggleRecording}
          >
            <Mic className="h-5 w-5" />
          </Button>

          <Button
            size="icon"
            className={`rounded-full h-10 w-10 shrink-0 shadow-md transition-all ${!inputValue.trim() && !selectedImage ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-[#22c55e] hover:bg-[#16a34a] text-[#0f172a] hover:scale-105'}`}
            onClick={handleSend}
            disabled={!inputValue.trim() && !selectedImage}
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div >
  )
}
