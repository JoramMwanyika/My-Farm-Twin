import { Menu, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header({ title = "AgriVoice" }: { title?: string }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#F0EFE9]/95 backdrop-blur supports-[backdrop-filter]:bg-[#F0EFE9]/60 border-b border-[#D1CEC4] dark:bg-[#0F231B]/95 dark:border-[#243D31]">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="-ml-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Menu</span>
          </Button>
          <h1 className="text-xl font-serif font-bold text-primary">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2 px-4 shadow-sm"
          >
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Voice Assistant</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
