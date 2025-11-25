"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CloudRain, Droplets, AlertTriangle, ArrowRight, Sprout, Wind } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"
import Link from "next/link"

export default function Dashboard() {
  const [isCheckCropsOpen, setIsCheckCropsOpen] = useState(false)
  const [isLogWaterOpen, setIsLogWaterOpen] = useState(false)
  const [waterAmount, setWaterAmount] = useState([20])

  const handleLogWater = () => {
    setIsLogWaterOpen(false)
    toast.success("Irrigation logged", {
      description: `Recorded ${waterAmount[0]} liters for Block A`,
    })
  }

  const handleUpdateCrop = () => {
    setIsCheckCropsOpen(false)
    toast.success("Crop status updated", {
      description: "Maize growth stage updated to Vegetative",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20 pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-3 duration-500">
          <h2 className="text-3xl font-serif text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Jambo, Samuel
          </h2>
          <p className="text-muted-foreground flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
            Here is your farm summary for today
          </p>
        </div>

        {/* High Priority Alerts */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <span className="h-px flex-1 bg-border" />
            Priority Alerts
            <span className="h-px flex-1 bg-border" />
          </h3>
          <Card className="bg-gradient-to-br from-[#FFF4E5] to-[#FFF8F0] border-[#E5B045] dark:bg-gradient-to-br dark:from-[#2C2415] dark:to-[#1C1410] dark:border-[#5C4515] shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-3 rounded-xl bg-[#E5B045]/20 text-[#B3831F] shadow-inner">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-2 flex-1">
                <h4 className="font-serif text-lg font-medium text-[#7A5815] dark:text-[#E5B045]">Dry Spell Warning</h4>
                <p className="text-sm text-[#7A5815]/80 dark:text-[#E5B045]/80 leading-relaxed">
                  Low rainfall expected next 3 days. Prepare irrigation.
                </p>
                <Button
                  variant="link"
                  className="px-0 text-[#7A5815] dark:text-[#E5B045] font-semibold h-auto p-0 mt-2 group"
                  onClick={() => toast.info("Recommendation: Irrigate 20L per sq meter")}
                >
                  View Recommendations <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Weather Snapshot */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Weather Today</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full shadow-sm">
              Nairobi, KE
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative group">
              <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors" />
              <CardContent className="p-5 flex flex-col items-center justify-center text-center space-y-3 relative z-10">
                <CloudRain className="h-12 w-12 mb-1 opacity-90 drop-shadow-lg" />
                <div>
                  <span className="text-4xl font-serif font-bold drop-shadow-md">24°C</span>
                  <p className="text-sm opacity-90 mt-1">Light Rain</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-rows-2 gap-4">
              <Card className="flex items-center p-4 gap-3 border-none bg-secondary shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Humidity</p>
                  <p className="font-bold text-lg text-foreground">65%</p>
                </div>
              </Card>
              <Card className="flex items-center p-4 gap-3 border-none bg-secondary shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wind className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Wind</p>
                  <p className="font-bold text-lg text-foreground">12 km/h</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Farm Quick Actions */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Dialog open={isCheckCropsOpen} onOpenChange={setIsCheckCropsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-3 bg-gradient-to-br from-card to-secondary border-border hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E8F5E9] to-primary/20 flex items-center justify-center text-primary shadow-md group-hover:shadow-xl transition-all group-hover:scale-110">
                    <Sprout className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <span className="block font-serif font-medium text-lg">Check Crops</span>
                    <span className="text-xs text-muted-foreground">Update growth stage</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Update Crop Status</DialogTitle>
                  <DialogDescription>Record the current progress of your crops.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="crop">Select Crop</Label>
                    <Select defaultValue="maize">
                      <SelectTrigger>
                        <SelectValue placeholder="Select crop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maize">Maize (Block A)</SelectItem>
                        <SelectItem value="beans">Beans (Block B)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stage">Growth Stage</Label>
                    <Select defaultValue="vegetative">
                      <SelectTrigger>
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="germination">Germination</SelectItem>
                        <SelectItem value="vegetative">Vegetative</SelectItem>
                        <SelectItem value="flowering">Flowering</SelectItem>
                        <SelectItem value="maturity">Maturity</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleUpdateCrop}>Save Update</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isLogWaterOpen} onOpenChange={setIsLogWaterOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-3 bg-gradient-to-br from-card to-secondary border-border hover:border-primary hover:bg-primary/5 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
                >
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E0F2F1] to-teal-700/20 flex items-center justify-center text-teal-700 shadow-md group-hover:shadow-xl transition-all group-hover:scale-110">
                    <Droplets className="h-6 w-6" />
                  </div>
                  <div className="text-center">
                    <span className="block font-serif font-medium text-lg">Log Water</span>
                    <span className="text-xs text-muted-foreground">Record irrigation</span>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Log Irrigation</DialogTitle>
                  <DialogDescription>How much water did you apply today?</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (Liters)</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={waterAmount}
                        onValueChange={setWaterAmount}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                      <span className="w-12 text-right font-mono font-bold">{waterAmount[0]}L</span>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="method">Method</Label>
                    <Select defaultValue="drip">
                      <SelectTrigger>
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="drip">Drip Irrigation</SelectItem>
                        <SelectItem value="sprinkler">Sprinkler</SelectItem>
                        <SelectItem value="manual">Manual / Can</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleLogWater}>Log Activity</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Soil Health Preview */}
        <section className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Soil Health</h3>
            <Link href="/farm" className="text-sm font-medium text-primary hover:underline flex items-center gap-1 group">
              View Full Report
              <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">Moisture Level</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-serif font-bold text-primary">Adequate</span>
                    <span className="text-sm text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">42%</span>
                  </div>
                </div>
                <div className="relative h-16 w-16">
                  <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin-slow" style={{ animationDuration: "3s" }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">Good</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Nitrogen (N)
                  </span>
                  <span className="font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                    Medium
                  </span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-primary to-primary/60 w-2/3 rounded-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
