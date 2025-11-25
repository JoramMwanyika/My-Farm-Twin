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
    <div className="min-h-screen bg-background pb-20">
      <Header title="My Profile" />

      <main className="container px-4 py-6 space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-4 py-4 relative">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center border-2 border-primary overflow-hidden">
            <User className="h-10 w-10 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold">{profile.name}</h2>
            <p className="text-muted-foreground">Smallholder Farmer</p>
            <p className="text-xs text-muted-foreground">{profile.location}</p>
          </div>

          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-0 top-6"
                onClick={() => setTempProfile(profile)}
              >
                <PenLine className="h-5 w-5 text-muted-foreground" />
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
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Settings List */}
        <Card>
          <CardContent className="p-0 divide-y divide-border">
            <Dialog open={isLanguageOpen} onOpenChange={setIsLanguageOpen}>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Language</p>
                      <p className="text-xs text-muted-foreground">
                        {currentLang.flag} {currentLang.name}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Language</DialogTitle>
                  <DialogDescription>Choose your preferred language for the app.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-2 py-4">
                  {LANGUAGES.map((lang) => (
                    <Button
                      key={lang.code}
                      variant={language === lang.code ? "default" : "outline"}
                      className="justify-start gap-3 h-12"
                      onClick={() => handleLanguageChange(lang.code)}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      {lang.name}
                    </Button>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-xs text-muted-foreground">Alerts & reminders</p>
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
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors"
              onClick={() => toast.info("App settings coming soon")}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">App Settings</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full gap-2 text-destructive hover:text-destructive bg-transparent"
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
