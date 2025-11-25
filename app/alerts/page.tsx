"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Droplets, ThermometerSun, Bug, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: "critical" },
    { id: 2, type: "warning" },
    { id: 3, type: "info" },
  ])

  const dismissAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 pb-20">
      <Header title="Alerts & Warnings" />

      <main className="container px-4 py-6 space-y-6">
        <div className="flex items-center justify-between mb-2 animate-in fade-in slide-in-from-top-3 duration-500">
          <h2 className="text-lg font-serif font-bold flex items-center gap-2">
            Active Alerts
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
              {alerts.length}
            </span>
          </h2>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Updated 10m ago
          </span>
        </div>

        {alerts.find((a) => a.type === "critical") && (
          <Card className="border-l-4 border-l-[#C94A4A] shadow-lg hover:shadow-xl relative group transition-all duration-300 hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-100">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive rounded-full"
              onClick={() => dismissAlert(1)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFE5E5] to-[#FFC9C9] flex items-center justify-center text-[#C94A4A] shrink-0 shadow-md">
                  <Bug className="h-6 w-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-[#C94A4A] text-base">Fall Armyworm Detected</h3>
                    <span className="text-[10px] bg-[#FFE5E5] text-[#C94A4A] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                      Critical
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    High risk of infestation in neighboring farms. Inspect maize funnel for larvae immediately.
                  </p>
                  <div className="p-3 bg-[#FFF4E5] border border-[#FFE5E5] rounded-lg mt-3">
                    <p className="text-xs font-medium text-[#7A5815] flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#E5B045] mt-1 shrink-0" />
                      Recommended: Apply Neem-based pesticide
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {alerts.find((a) => a.type === "warning") && (
          <Card className="border-l-4 border-l-[#E5B045] shadow-md hover:shadow-lg relative group transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-200">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary rounded-full"
              onClick={() => dismissAlert(2)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFF4E5] to-[#FFE8B3] flex items-center justify-center text-[#E5B045] shrink-0 shadow-md">
                  <ThermometerSun className="h-6 w-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-[#B3831F] text-base">Heat Stress Risk</h3>
                    <span className="text-[10px] bg-[#FFF4E5] text-[#B3831F] px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                      Warning
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Temperatures expected to reach 32°C tomorrow. Ensure crops are well-mulched to retain moisture.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {alerts.find((a) => a.type === "info") && (
          <Card className="border-l-4 border-l-primary shadow-sm hover:shadow-md relative group transition-all duration-300 hover:-translate-y-0.5 animate-in fade-in slide-in-from-bottom-3 duration-500 delay-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary rounded-full"
              onClick={() => dismissAlert(3)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardContent className="p-5">
              <div className="flex gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#E8F5E9] to-primary/20 flex items-center justify-center text-primary shrink-0 shadow-md">
                  <Droplets className="h-6 w-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-primary text-base">Irrigation Reminder</h3>
                    <span className="text-[10px] bg-[#E8F5E9] text-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wide shadow-sm">
                      Info
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Scheduled irrigation for Block A is due at 6:00 PM today.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {alerts.length === 0 && (
          <div className="text-center py-16 space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl mb-2">All Clear!</h3>
              <p className="text-muted-foreground text-sm">No active alerts at the moment</p>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
