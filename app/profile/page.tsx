"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { User, Globe, ChevronRight, LogOut, Settings, Bell, PenLine, Shield, HelpCircle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "ki", name: "Gikuyu", flag: "🇰🇪" },
  { code: "luo", name: "Dholuo", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "af", name: "Afrikaans", flag: "🇿🇦" },
  { code: "am", name: "Amharic", flag: "🇪🇹" },
  { code: "ar-DZ", name: "Arabic (Algeria)", flag: "🇩🇿" },
  { code: "ar-EG", name: "Arabic (Egypt)", flag: "🇪🇬" },
  { code: "ar-MA", name: "Arabic (Morocco)", flag: "🇲🇦" },
  { code: "ha", name: "Hausa", flag: "🇳🇬" },
  { code: "ig", name: "Igbo", flag: "🇳🇬" },
  { code: "rw", name: "Kinyarwanda", flag: "🇷🇼" },
  { code: "st", name: "Sesotho", flag: "🇿🇦" },
  { code: "sn", name: "Shona", flag: "🇿🇼" },
  { code: "so", name: "Somali", flag: "🇸🇴" },
  { code: "ti", name: "Tigrinya", flag: "🇪🇹" },
  { code: "ts", name: "Tsonga", flag: "🇿🇦" },
  { code: "tn", name: "Tswana", flag: "🇿🇦" },
  { code: "wo", name: "Wolof", flag: "🇸🇳" },
  { code: "xh", name: "Xhosa", flag: "🇿🇦" },
  { code: "yo", name: "Yoruba", flag: "🇳🇬" },
  { code: "zu", name: "Zulu", flag: "🇿🇦" },
]

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLang = localStorage.getItem("agriTwin-language")
    if (savedLang && LANGUAGES.some(l => l.code === savedLang)) {
      setLanguage(savedLang)
    }
  }, [])

  const [profile, setProfile] = useState({
    name: "Samuel K.",
    location: "Kiambu, Kenya",
    role: "Smallholder Farmer",
    email: "samuel.k@agrivoice.demo"
  })
  const [tempProfile, setTempProfile] = useState(profile)

  const handleSaveProfile = () => {
    setProfile(tempProfile)
    setIsEditOpen(false)
    toast.success("Profile updated successfully")
  }

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
    localStorage.setItem("agriTwin-language", code)
    const lang = LANGUAGES.find((l) => l.code === code)
    toast.success(`Language changed to ${lang?.name}`)
  }

  return (
    <div className="min-h-screen bg-[#f0efe9] pb-24">
      <Header title="My Profile" />

      <main className="container px-4 py-6 space-y-6 max-w-4xl mx-auto">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0a1f16] to-[#14532d] shadow-xl p-6 text-white"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0ff01]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#4ade80]/10 rounded-full blur-3xl -ml-12 -mb-12 pointer-events-none" />

          <div className="relative z-10 flex gap-5 items-start">
            <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-[#c0ff01] to-[#4ade80] p-[2px] shadow-lg shadow-black/20">
              <div className="w-full h-full rounded-[14px] bg-[#0a1f16] flex items-center justify-center overflow-hidden">
                <User className="h-10 w-10 text-[#c0ff01]" />
              </div>
            </div>

            <div className="flex-1 pt-1">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-serif font-bold text-white tracking-wide">{profile.name}</h2>
                  <p className="text-[#c0ff01] font-medium text-sm mb-1">{profile.role}</p>
                </div>
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white/70 hover:text-white hover:bg-white/10 rounded-full"
                      onClick={() => setTempProfile(profile)}
                    >
                      <PenLine className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">Edit Profile</DialogTitle>
                      <DialogDescription>Update your personal information visible on AgriTwin.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={tempProfile.name}
                          onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                          className="focus-visible:ring-[#14532d]"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={tempProfile.location}
                          onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                          className="focus-visible:ring-[#14532d]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleSaveProfile} className="bg-[#14532d] text-white hover:bg-[#0a1f16]">Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                  📍 {profile.location}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-medium backdrop-blur-sm flex items-center gap-1.5">
                  📧 {profile.email}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Groups */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2">Preferences</h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0 divide-y divide-gray-100">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full h-auto border-0 shadow-none p-4 hover:bg-gray-50 transition-colors [&>span]:w-full">
                    <div className="flex items-center gap-4 text-left">
                      <div className="h-10 w-10 rounded-full bg-[#e6f4ea] flex items-center justify-center">
                        <Globe className="h-5 w-5 text-[#14532d]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">Language</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          Current: <span className="font-medium text-gray-800 flex items-center gap-1"><SelectValue placeholder={LANGUAGES[0].name} /></span>
                        </p>
                      </div>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <span className="flex items-center gap-2">
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center justify-between p-4 group">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[#e6f4ea] flex items-center justify-center group-hover:bg-[#dcefe3] transition-colors">
                      <Bell className="h-5 w-5 text-[#14532d]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Notifications</p>
                      <p className="text-xs text-gray-500">Weather alerts & task reminders</p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={(checked) => {
                      setNotifications(checked)
                      toast.success(checked ? "Notifications enabled" : "Notifications disabled")
                    }}
                    className="data-[state=checked]:bg-[#14532d]"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider ml-2 mt-6">Support & Security</h3>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
              <CardContent className="p-0 divide-y divide-gray-100">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                  onClick={() => toast.info("Privacy settings coming soon")}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Shield className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Privacy & Security</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                  onClick={() => toast.info("Help center coming soon")}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                      <HelpCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Help & Support</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                </div>

                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors group"
                  onClick={() => toast.info("App settings coming soon")}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <Settings className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">App Settings</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-4"
        >
          <Button
            variant="outline"
            className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border border-red-200 shadow-sm h-12 text-base font-medium rounded-xl"
            onClick={() => toast.info("Sign out functionality coming soon")}
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>

          <div className="text-center mt-6 text-xs text-gray-400">
            <p>AgriTwin v0.1.0 (Beta)</p>
          </div>
        </motion.div>

        {/* Bottom Navigation */}
        <BottomNav />
      </main>
    </div>
  )
}
