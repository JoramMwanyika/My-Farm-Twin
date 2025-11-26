"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { User, Globe, ChevronRight, LogOut, Settings, Bell, PenLine } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Kiswahili", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
]

export default function ProfilePage() {
  const [notifications, setNotifications] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [language, setLanguage] = useState("en")
  const [profile, setProfile] = useState({
    name: "Samuel K.",
    location: "Kiambu, Kenya",
  })
  const [tempProfile, setTempProfile] = useState(profile)

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0]

  const handleSaveProfile = () => {
    setProfile(tempProfile)
    setIsEditOpen(false)
    toast.success("Profile updated successfully")
  }

  const handleLanguageChange = (code: string) => {
    setLanguage(code)
    const lang = LANGUAGES.find((l) => l.code === code)
    setIsLanguageOpen(false)
    toast.success(`Language changed to ${lang?.name}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF3] via-[#F0FDF4] to-[#FEFCE8] pb-20">
      <Header title="Profile" />

      <main className="container px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 py-6 px-4 bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border-2 border-green-200 relative animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center border-4 border-white shadow-xl overflow-hidden">
            <User className="h-10 w-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-green-900">{profile.name}</h2>
            <p className="text-green-700 font-medium">Smallholder Farmer</p>
            <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
              📍 {profile.location}
            </p>
          </div>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-4 top-6 hover:bg-green-100 rounded-full"
                onClick={() => setTempProfile(profile)}
              >
                <PenLine className="h-5 w-5 text-green-600" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>Update your personal information.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={tempProfile.name}
                    onChange={(e) => setTempProfile({ ...tempProfile, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={tempProfile.location}
                    onChange={(e) => setTempProfile({ ...tempProfile, location: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-700">Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Settings List */}
        <Card className="shadow-lg border-2 border-green-200 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '100ms' }}>
          <CardContent className="p-0 divide-y divide-green-100">
            <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                      <Globe className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-green-900">Language</p>
                      <p className="text-xs text-green-600">
                        {currentLang.flag} {currentLang.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Language</DialogTitle>
                  <DialogDescription>Choose your preferred language for AgriVoice.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "outline"}
                      className={`justify-start gap-3 h-12 ${language === lang.code ? 'bg-green-600 hover:bg-green-700' : 'border-green-300 hover:bg-green-50'}`}
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between p-4 hover:bg-green-50 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Bell className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">Notifications</p>
                  <p className="text-xs text-green-600">Alerts & reminders</p>
                </div>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={(checked) => {
                  setNotifications(checked)
                  toast.success(checked ? "Notifications enabled" : "Notifications disabled")
                }}
              />
            </div>

            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-green-50 transition-colors group"
              onClick={() => toast.info("App settings coming soon")}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-green-100 group-hover:bg-green-200 transition-colors">
                  <Settings className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">App Settings</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-white border-2 border-red-300 shadow-md hover:shadow-lg transition-all"
          onClick={() => toast.info("Sign out functionality coming soon")}
        >
          <LogOut className="h-4 w-4" /> Sign Out
        </Button>

        {/* Bottom Navigation */}
        <BottomNav />
      </main>
    </div>
  )
}
