"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Mic, Send, Volume2, VolumeX, Globe, Loader2, Camera, X, ImageIcon } from "lucide-react"
import { toast } from "sonner"
import { speakText, startSpeechRecognition } from "@/lib/speech"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

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
  const [language, setLanguage] = useState("en")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<{ stop: () => void } | null>(null)
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

  const sendToAI = async (userText: string, imageAnalysisData?: string) => {
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

      if (autoSpeak) {
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
        imageAnalysisData = `Plant Type: ${analysis.plantType || "Unknown"}, Condition: ${analysis.condition || "Unknown"}, Severity: ${analysis.severity || "Unknown"}, Symptoms: ${analysis.symptoms?.join(", ") || "None detected"}, Image Description: ${rawVision.caption}`
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

  const handleSpeak = async (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }

    setIsSpeaking(true)
    try {
      await speakText(text, language)
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
    <div className="flex flex-col h-screen bg-background">
      <Header title="Farm Advisor" />

      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Globe className="h-4 w-4" />
              {currentLang.flag} {currentLang.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={language === lang.code ? "bg-secondary" : ""}
              >
                {lang.flag} {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={autoSpeak ? "default" : "outline"}
          size="sm"
          className="gap-2"
          onClick={() => setAutoSpeak(!autoSpeak)}
        >
          {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Auto-speak
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="text-xs font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">Today</span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                msg.role === "ai" ? "bg-primary" : "bg-[#E5B045]"
              }`}
            >
              {msg.role === "ai" ? "AI" : "Me"}
            </div>
            <div className={`space-y-2 max-w-[85%] ${msg.role === "user" ? "flex flex-col items-end" : ""}`}>
              <Card
                className={`border-none p-4 shadow-sm ${
                  msg.role === "ai"
                    ? "bg-white rounded-tl-none dark:bg-card"
                    : "bg-primary text-primary-foreground rounded-tr-none"
                }`}
              >
                {msg.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <Image
                      src={msg.image || "/placeholder.svg"}
                      alt="Uploaded crop"
                      width={200}
                      height={150}
                      className="w-full max-w-[200px] h-auto object-cover rounded-lg"
                    />
                  </div>
                )}

                <p className="text-sm leading-relaxed">{msg.text}</p>

                {msg.analysis && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-muted-foreground">Plant:</span>
                      <span className="text-xs font-semibold">{msg.analysis.plantType || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-medium text-muted-foreground">Condition:</span>
                      <span className="text-xs font-semibold">{msg.analysis.condition || "Unknown"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Severity:</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${getSeverityColor(msg.analysis.severity)}`}
                      >
                        {msg.analysis.severity || "Unknown"}
                      </span>
                    </div>
                    {msg.analysis.symptoms && msg.analysis.symptoms.length > 0 && (
                      <div className="pt-1">
                        <span className="text-xs font-medium text-muted-foreground">Symptoms:</span>
                        <ul className="mt-1 space-y-0.5">
                          {msg.analysis.symptoms.map((symptom, idx) => (
                            <li key={idx} className="text-xs flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {symptom}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {msg.actions && (
                  <div className="mt-3 flex gap-2 flex-wrap">
                    {msg.actions.map((action) => (
                      <Button
                        key={action}
                        size="sm"
                        variant="secondary"
                        className="h-8 text-xs rounded-full"
                        onClick={() => handleActionClick(action)}
                      >
                        {action === "Scan plant for disease" && <Camera className="h-3 w-3 mr-1" />}
                        {action}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
              {msg.role === "ai" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-muted-foreground"
                  onClick={() => handleSpeak(msg.text)}
                >
                  <Volume2 className="h-3 w-3 mr-1" />
                  <span className="text-xs">Listen</span>
                </Button>
              )}
            </div>
          </div>
        ))}

        {(isLoading || isAnalyzing) && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
              AI
            </div>
            <Card className="rounded-tl-none border-none bg-white p-4 shadow-sm dark:bg-card">
              <div className="flex items-center gap-2">
                {isAnalyzing && <span className="text-xs text-muted-foreground">Analyzing image...</span>}
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {imagePreview && (
        <div className="fixed bottom-32 left-0 right-0 px-4 z-10">
          <div className="max-w-md mx-auto bg-card border border-border rounded-lg p-2 flex items-center gap-2">
            <div className="relative h-16 w-16 rounded overflow-hidden shrink-0">
              <Image src={imagePreview || "/placeholder.svg"} alt="Selected" fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{selectedImage?.name}</p>
              <p className="text-xs text-muted-foreground">Ready to analyze</p>
            </div>
            <Button size="icon" variant="ghost" className="shrink-0" onClick={clearImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div
        className={`fixed ${imagePreview ? "bottom-16" : "bottom-16"} left-0 right-0 p-4 bg-background border-t border-border z-10`}
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

        <div className="relative flex items-center gap-2 max-w-md mx-auto">
          <Button
            size="icon"
            variant={isRecording ? "destructive" : "secondary"}
            className="shrink-0 h-12 w-12 rounded-full transition-colors"
            onClick={toggleRecording}
            disabled={isLoading || isAnalyzing}
          >
            {isRecording ? <Loader2 className="h-5 w-5 animate-spin" /> : <Mic className="h-5 w-5" />}
          </Button>

          <Button
            size="icon"
            variant="secondary"
            className="shrink-0 h-12 w-12 rounded-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading || isAnalyzing}
          >
            {selectedImage ? <ImageIcon className="h-5 w-5 text-primary" /> : <Camera className="h-5 w-5" />}
          </Button>

          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={selectedImage ? "Describe your concern..." : "Ask a question..."}
              className="w-full h-12 pl-4 pr-10 rounded-full border border-input bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !isLoading && !isAnalyzing && handleSend()}
              disabled={isLoading || isAnalyzing}
            />
          </div>
          <Button
            size="icon"
            className="shrink-0 h-12 w-12 rounded-full"
            onClick={handleSend}
            disabled={(!inputValue.trim() && !selectedImage) || isLoading || isAnalyzing}
          >
            {isLoading || isAnalyzing ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
