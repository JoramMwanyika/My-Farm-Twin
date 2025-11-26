"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Send, Volume2, VolumeX, Globe, Loader2, Camera, X, ImageIcon, Phone, PhoneOff } from "lucide-react"
import { toast } from "sonner"
import { speakText, startSpeechRecognition, startContinuousRecognition } from "@/lib/speech"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

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
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

export default function AdvisorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "ai",
      text: "Jambo! I am AgriVoice, your AI farming assistant. How can I help you today? You can also take a photo of your crops to check for diseases!",
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
    setIsLoading(true)

    try {
      // Translate to English if needed
      let textToSend = userText
      if (language !== "en") {
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

      // Translate response if needed
      let finalMessage = message
      if (language !== "en") {
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

      // Auto-speak if enabled or if in voice mode
      if (autoSpeak || autoSpeakResponse) {
        handleSpeak(finalMessage)
      }
    } catch (error) {
      console.error("AI Error:", error)
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "ai",
        text: "I'm sorry, I'm having trouble connecting right now. Please check your internet connection and try again.",
      }
      setMessages((prev) => [...prev, aiMsg])
      toast.error("Connection issue. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() && !selectedImage) return

    const userText = inputValue.trim() || "Please analyze this image of my crop"

    // Add user message with image if present
    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      text: userText,
      image: imagePreview || undefined,
    }
    setMessages((prev) => [...prev, userMsg])
    setInputValue("")

    let imageAnalysisData: string | undefined

    // If there's an image, analyze it first
    if (selectedImage) {
      setIsAnalyzing(true)
      toast("Analyzing your crop image...", { description: "This may take a moment" })

      const result = await analyzeImage(selectedImage)
      setIsAnalyzing(false)

      if (result) {
        const { analysis, rawVision } = result

        // Add analysis result message
        const analysisMsg: Message = {
          id: Date.now() + 0.5,
          role: "ai",
          text: `I've analyzed your image. Here's what I found:`,
          analysis: analysis,
        }
        setMessages((prev) => [...prev, analysisMsg])

        // Prepare context for AI
        if (analysis && rawVision) {
          imageAnalysisData = `Plant Type: ${analysis.plantType || "Unknown"}, Condition: ${analysis.condition || "Unknown"}, Severity: ${analysis.severity || "Unknown"}, Symptoms: ${analysis.symptoms?.join(", ") || "None detected"}, Image Description: ${rawVision.caption}`
        }
      } else {
        toast.error("Could not analyze the image. Please try again.")
      }

      // Clear image after sending
      setSelectedImage(null)
      setImagePreview(null)
    }

    // Send to AI for advice
    await sendToAI(userText, imageAnalysisData)
  }

  const handleActionClick = (action: string) => {
    if (action === "Scan plant for disease") {
      fileInputRef.current?.click()
      return
    }

    const userMsg: Message = { id: Date.now(), role: "user", text: action }
    setMessages((prev) => [...prev, userMsg])
    sendToAI(action)
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large", { description: "Please select an image under 10MB" })
        return
      }

      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success("Image selected", { description: "Send your message to analyze" })
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
        async (text, detectedLang) => {
          setIsRecording(false)
          
          // Show what was heard
          toast.success("Got it!", { description: text })
          
          // If not English, translate to English for better AI understanding
          if (language !== "en") {
            try {
              const translateRes = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, from: language, to: "en" }),
              })
              
              if (translateRes.ok) {
                const { translatedText } = await translateRes.json()
                setInputValue(translatedText)
                toast("Translated", { description: `"${text}" → "${translatedText}"` })
              } else {
                setInputValue(text)
              }
            } catch (error) {
              console.error("Translation error:", error)
              setInputValue(text)
            }
          } else {
            setInputValue(text)
          }
        },
        () => {
          setIsRecording(false)
          toast.error("Could not hear you", { description: "Please try again" })
        },
        language,
      )
    }
  }

  const toggleVoiceMode = async () => {
    if (isVoiceMode) {
      // Stop voice conversation mode
      continuousRecognitionRef.current?.stop()
      setIsVoiceMode(false)
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      toast.info("Voice conversation ended", { description: "You can still type or use the mic button" })
    } else {
      // Start voice conversation mode
      setIsVoiceMode(true)
      toast.success("Voice conversation started", { 
        description: `Speak in ${currentLang.name}. I'll respond automatically.`,
        duration: 3000
      })

      continuousRecognitionRef.current = await startContinuousRecognition(
        async (text, detectedLang) => {
          if (!text.trim() || isLoading) return
          
          toast.success("Heard you", { description: text })
          
          // Add user message
          const userMsg: Message = { id: Date.now(), role: "user", text }
          setMessages((prev) => [...prev, userMsg])
          
          // Send to AI and auto-speak response
          await sendToAI(text, undefined, true)
        },
        (error) => {
          console.error("Voice mode error:", error)
          if (error !== 'no-speech') {
            toast.error("Voice error", { description: "Restarting listening..." })
          }
        },
        (isListening) => {
          // Visual feedback for listening state
          if (!isListening && isVoiceMode) {
            // Recognition stopped unexpectedly, might need to restart
            console.log("Recognition stopped, mode still active")
          }
        },
        language,
      )
    }
  }

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    // Clean markdown syntax for speech
    const cleanText = text
      // Remove bold and italic markers
      .replace(/\*\*\*(.+?)\*\*\*/g, '$1')  // bold + italic
      .replace(/\*\*(.+?)\*\*/g, '$1')      // bold
      .replace(/\*(.+?)\*/g, '$1')          // italic
      .replace(/_(.+?)_/g, '$1')            // italic underscore
      // Remove headers
      .replace(/^#{1,6}\s+/gm, '')
      // Remove code blocks
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`([^`]+)`/g, '$1')
      // Remove links but keep text
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
      // Remove bullet points and list markers
      .replace(/^\s*[-*+]\s+/gm, '')
      .replace(/^\s*\d+\.\s+/gm, '')
      // Remove blockquotes
      .replace(/^\s*>\s+/gm, '')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim()

    setIsSpeaking(true)
    try {
      await speakText(cleanText, language)
    } catch {
      toast.error("Could not speak the message")
    } finally {
      setIsSpeaking(false)
    }
  }

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const getSeverityColor = (severity: string) => {
    switch (severity?.toLowerCase()) {
      case "severe":
        return "bg-red-500 text-white"
      case "moderate":
        return "bg-yellow-500 text-white"
      case "mild":
        return "bg-orange-400 text-white"
      case "healthy":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-400 text-white"
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#F7FFF3] via-[#F0FDF4] to-[#FEFCE8]">
      <Header title="AgriVoice" />

      <div className="flex items-center justify-between px-4 py-3 border-b border-green-200/50 bg-white/80 backdrop-blur-sm shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-white border-green-300 hover:bg-green-50 hover:border-green-400 transition-all">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="font-medium">{currentLang.flag} {currentLang.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-green-50 font-medium" : ""}
              >
                <span className="text-lg mr-2">{lang.flag}</span> {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-2">
          <Button
            variant={isVoiceMode ? "default" : "outline"}
            size="sm"
            className={`gap-2 transition-all ${
              isVoiceMode 
                ? 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg animate-pulse' 
                : 'border-green-300 hover:bg-green-50'
            }`}
            onClick={toggleVoiceMode}
            disabled={isLoading || isAnalyzing}
          >
            {isVoiceMode ? (
              <>
                <PhoneOff className="h-4 w-4" />
                <span className="hidden sm:inline">End Call</span>
              </>
            ) : (
              <>
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">Voice Chat</span>
              </>
            )}
          </Button>

          <Button
            variant={autoSpeak ? "default" : "outline"}
            size="sm"
            className={`gap-2 transition-all ${autoSpeak ? 'bg-green-600 hover:bg-green-700 shadow-md' : 'border-green-300 hover:bg-green-50'}`}
            onClick={() => setAutoSpeak(!autoSpeak)}
          >
            {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            <span className="hidden sm:inline">Auto-speak</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {/* Date Divider */}
        <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-500">
          <span className="text-xs font-semibold text-green-700 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-sm border border-green-200">
            Today • {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Voice Mode Indicator */}
        {isVoiceMode && (
          <div className="flex justify-center animate-in fade-in slide-in-from-top-2 duration-500">
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-2xl shadow-lg border-2 border-green-400 flex items-center gap-3 animate-pulse">
              <div className="flex gap-1">
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-4 bg-white rounded-full animate-bounce"></span>
              </div>
              <span className="text-sm font-bold">Voice Conversation Active - Speak Freely</span>
              <Phone className="h-4 w-4" />
            </div>
          </div>
        )}

        {messages.map((msg, index) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""} animate-in fade-in slide-in-from-bottom-3 duration-500`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-lg ${
                msg.role === "ai" 
                  ? "bg-gradient-to-br from-green-500 to-green-600 ring-2 ring-green-200" 
                  : "bg-gradient-to-br from-amber-500 to-amber-600 ring-2 ring-amber-200"
              }`}
            >
              {msg.role === "ai" ? "🌾" : "👤"}
            </div>
            <div className={`space-y-2 max-w-[85%] ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
              <Card
                className={`border-none shadow-lg transition-all hover:shadow-xl ${
                  msg.role === "ai"
                    ? "bg-white rounded-tl-none"
                    : "bg-gradient-to-br from-green-600 to-green-700 text-white rounded-tr-none shadow-green-500/30"
                }`}
              >
                <CardContent className="p-4">
                  {msg.image && (
                    <div className="mb-3 rounded-xl overflow-hidden shadow-md">
                      <Image
                        src={msg.image || "/placeholder.svg"}
                        alt="Uploaded crop"
                        width={250}
                        height={200}
                        className="w-full max-w-[250px] h-auto object-cover"
                      />
                    </div>
                  )}

                  <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${
                    msg.role === "ai" 
                      ? "prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700" 
                      : "prose-headings:text-white prose-p:text-white prose-strong:text-white prose-ul:text-white prose-ol:text-white prose-li:text-white prose-a:text-green-100"
                  }`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        // Customize rendering for better chat appearance
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 ml-4 list-disc space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 ml-4 list-decimal space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="ml-1">{children}</li>,
                        strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                        em: ({ children }) => <em className="italic">{children}</em>,
                        h1: ({ children }) => <h1 className="text-lg font-bold mb-2 mt-3 first:mt-0">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-bold mb-1 mt-2 first:mt-0">{children}</h3>,
                        code: ({ inline, children }: any) => 
                          inline ? (
                            <code className={`px-1.5 py-0.5 rounded text-xs font-mono ${
                              msg.role === "ai" 
                                ? "bg-green-100 text-green-800" 
                                : "bg-green-800 text-green-100"
                            }`}>
                              {children}
                            </code>
                          ) : (
                            <code className={`block px-3 py-2 rounded-lg text-xs font-mono my-2 ${
                              msg.role === "ai"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-green-800 text-green-100"
                            }`}>
                              {children}
                            </code>
                          ),
                        blockquote: ({ children }) => (
                          <blockquote className={`border-l-4 pl-3 py-1 my-2 italic ${
                            msg.role === "ai"
                              ? "border-green-500 text-gray-600"
                              : "border-green-300 text-green-100"
                          }`}>
                            {children}
                          </blockquote>
                        ),
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  </div>

                  {msg.analysis && (
                    <div className="mt-4 p-4 bg-green-50/50 backdrop-blur-sm rounded-xl space-y-3 border border-green-200">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-green-700">🌱 Plant:</span>
                        <span className="text-xs font-bold text-green-900 bg-green-100 px-2 py-1 rounded-full">
                          {msg.analysis.plantType || "Unknown"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-green-700">📊 Condition:</span>
                        <span className="text-xs font-semibold text-green-900">{msg.analysis.condition || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-green-700">⚠️ Severity:</span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${getSeverityColor(msg.analysis.severity)}`}
                        >
                          {msg.analysis.severity || "Unknown"}
                        </span>
                      </div>
                      {msg.analysis.symptoms && msg.analysis.symptoms.length > 0 && (
                        <div className="pt-2 border-t border-green-200">
                          <span className="text-xs font-semibold text-green-700 block mb-2">🔍 Symptoms:</span>
                          <ul className="space-y-1.5">
                            {msg.analysis.symptoms.map((symptom, idx) => (
                              <li key={idx} className="text-xs flex items-start gap-2 text-green-900">
                                <span className="text-green-600 font-bold">•</span>
                                <span className="flex-1">{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {msg.actions && (
                    <div className="mt-4 flex gap-2 flex-wrap">
                      {msg.actions.map((action) => (
                        <Button
                          key={action}
                          size="sm"
                          variant="secondary"
                          className="h-9 text-xs rounded-full bg-green-100 text-green-700 hover:bg-green-200 border border-green-300 shadow-sm hover:shadow-md transition-all"
                          onClick={() => handleActionClick(action)}
                        >
                          {action === "Scan plant for disease" && <Camera className="h-3 w-3 mr-1.5" />}
                          {action}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
              {msg.role === "ai" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 text-green-700 hover:text-green-800 hover:bg-green-50 rounded-full"
                  onClick={() => handleSpeak(msg.text)}
                >
                  <Volume2 className="h-3.5 w-3.5 mr-1.5" />
                  <span className="text-xs font-medium">Listen</span>
                </Button>
              )}
            </div>
          </div>
        ))}

        {(isLoading || isAnalyzing) && (
          <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg ring-2 ring-green-200">
              🌾
            </div>
            <Card className="rounded-tl-none border-none bg-white shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {isAnalyzing && <span className="text-xs font-medium text-green-700">Analyzing image...</span>}
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="fixed bottom-36 left-0 right-0 px-4 z-10 animate-in slide-in-from-bottom-4 duration-300">
          <div className="max-w-md mx-auto bg-white border-2 border-green-300 rounded-2xl p-3 flex items-center gap-3 shadow-2xl shadow-green-500/30">
            <div className="relative h-20 w-20 rounded-xl overflow-hidden shrink-0 ring-2 ring-green-400">
              <Image src={imagePreview || "/placeholder.svg"} alt="Selected" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-green-900">{selectedImage?.name}</p>
              <p className="text-xs text-green-700 font-medium">Ready to analyze • Tap send</p>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0 hover:bg-red-50 hover:text-red-600 rounded-full" onClick={clearImage}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={`fixed ${imagePreview ? "bottom-16" : "bottom-16"} left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-sm border-t border-green-200/50 z-10`}
      >
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageSelect}
        />

        <div className="relative flex items-center gap-2.5 max-w-2xl mx-auto">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "outline"}
            className={`shrink-0 h-13 w-13 rounded-full transition-all shadow-lg ${
              isRecording 
                ? 'animate-pulse shadow-red-500/50 bg-gradient-to-br from-red-500 to-red-600' 
                : 'bg-white border-2 border-green-300 hover:border-green-500 hover:bg-green-50 hover:scale-110'
            }`}
            onClick={toggleRecording}
            disabled={isLoading || isAnalyzing}
          >
            {isRecording ? <Loader2 className="h-6 w-6 animate-spin" /> : <Mic className="h-6 w-6 text-green-600" />}
          </Button>

          <Button
            size="icon"
            variant="outline"
            className={`shrink-0 h-13 w-13 rounded-full bg-white border-2 transition-all shadow-lg hover:scale-110 ${
              selectedImage 
                ? 'border-green-500 bg-green-50' 
                : 'border-green-300 hover:border-green-500 hover:bg-green-50'
            }`}
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isAnalyzing}
          >
            {selectedImage ? <ImageIcon className="h-6 w-6 text-green-600" /> : <Camera className="h-6 w-6 text-green-600" />}
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={selectedImage ? "Describe your concern..." : "Ask me anything about farming..."}
              className="w-full h-13 pl-5 pr-4 rounded-full border-2 border-green-300 bg-white text-sm font-medium focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 shadow-lg transition-all placeholder:text-green-600/50"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && !isAnalyzing && handleSend()}
              disabled={isLoading || isAnalyzing}
            />
          </div>
          <Button
            size="icon"
            className={`shrink-0 h-13 w-13 rounded-full shadow-lg transition-all ${
              (!inputValue.trim() && !selectedImage) || isLoading || isAnalyzing
                ? 'bg-gray-300'
                : 'bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-110 hover:shadow-xl hover:shadow-green-500/50'
            }`}
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedImage) || isLoading || isAnalyzing}
          >
            {isLoading || isAnalyzing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
