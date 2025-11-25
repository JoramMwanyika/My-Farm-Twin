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
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="container px-4 py-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h2 className="text-3xl font-serif text-foreground">Jambo, Samuel</h2>
          <p className="text-muted-foreground">Here is your farm summary for today.</p>
        </div>

        {/* High Priority Alerts */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Priority Alerts</h3>
          <Card className="bg-[#FFF4E5] border-[#E5B045] dark:bg-[#2C2415] dark:border-[#5C4515]">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="p-2 rounded-full bg-[#E5B045]/20 text-[#B3831F]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-medium text-[#7A5815] dark:text-[#E5B045]">Dry Spell Warning</h4>
                <p className="text-sm text-[#7A5815]/80 dark:text-[#E5B045]/80">
                  Low rainfall expected next 3 days. Prepare irrigation.
                </p>
                <Button
                  variant="link"
                  className="px-0 text-[#7A5815] dark:text-[#E5B045] font-semibold h-auto p-0 mt-2"
                  onClick={() => toast.info("Recommendation: Irrigate 20L per sq meter")}
                >
                  View Recommendations <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Weather Snapshot */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Weather Today</h3>
            <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-full">Nairobi, KE</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-primary text-primary-foreground border-none">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center space-y-2">
                <CloudRain className="h-10 w-10 mb-1 opacity-90" />
                <div>
                  <span className="text-3xl font-serif font-bold">24°C</span>
                  <p className="text-sm opacity-80">Light Rain</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-rows-2 gap-4">
              <Card className="flex items-center p-3 gap-3 border-none bg-secondary">
                <Droplets className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Humidity</p>
                  <p className="font-bold text-foreground">65%</p>
                </div>
              </Card>
              <Card className="flex items-center p-3 gap-3 border-none bg-secondary">
                <Wind className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground font-medium">Wind</p>
                  <p className="font-bold text-foreground">12 km/h</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Farm Quick Actions */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Dialog open={isCheckCropsOpen} onOpenChange={setIsCheckCropsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-auto py-6 flex flex-col gap-3 bg-card border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-[#E8F5E9] flex items-center justify-center text-primary">
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
                  className="h-auto py-6 flex flex-col gap-3 bg-card border-border hover:border-primary hover:bg-primary/5 transition-all"
                >
                  <div className="h-10 w-10 rounded-full bg-[#E0F2F1] flex items-center justify-center text-teal-700">
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
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Soil Health</h3>
            <Link href="/farm" className="text-sm font-medium text-primary hover:underline">
              View Full Report
            </Link>
          </div>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Moisture Level</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-serif font-bold text-primary">Adequate</span>
                    <span className="text-sm text-muted-foreground">42%</span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center">
                  <span className="text-xs font-bold text-primary">Good</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Nitrogen (N)</span>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3 rounded-full" />
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
