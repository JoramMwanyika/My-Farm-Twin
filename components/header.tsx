import { Leaf } from "lucide-react"
import Link from "next/link"

export function Header({ title = "AgriVoice" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-[#1FAA59] via-[#22C55E] to-[#16A34A] shadow-lg shadow-green-500/20">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-all duration-300 group-hover:scale-110 shadow-inner">
            <Leaf className="h-6 w-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              {title === "AgriVoice" ? "AgriVoice" : title}
            </h1>
            <p className="text-[10px] sm:text-xs text-white/90 font-medium -mt-0.5">Your Smart Farm Assistant</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
            <span className="text-xs font-medium text-white">AI Active</span>
          </div>
        </div>
      </div>
    </header>
  )
}
