"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Sprout,
  Wind,
  Sun,
  Thermometer,
  Leaf,
  TrendingUp,
  Clock,
  CheckCircle2,
  MapPin,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import Link from "next/link";

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  clouds: {
    all: number;
  };
  name: string;
  coord: {
    lat: number;
    lon: number;
  };
}

export default function Dashboard() {
  const [isCheckCropsOpen, setIsCheckCropsOpen] = useState(false);
  const [isLogWaterOpen, setIsLogWaterOpen] = useState(false);
  const [waterAmount, setWaterAmount] = useState([20]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState("Nairobi");

  // Get user's location and fetch weather
  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ lat: latitude, lon: longitude });
              await fetchWeather(latitude, longitude);
            },
            async (error) => {
              console.log("Location permission denied, using default location");
              // Fallback to default location (Nairobi)
              await fetchWeather();
            }
          );
        } else {
          await fetchWeather();
        }
      } catch (error) {
        console.error("Error getting location:", error);
        await fetchWeather();
      }
    };

    getLocationAndWeather();
  }, []);

  const fetchWeather = async (lat?: number, lon?: number) => {
    setIsLoadingWeather(true);
    try {
      let url = '/api/weather';
      if (lat && lon) {
        url += `?lat=${lat}&lon=${lon}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      setWeather(data);
      setLocationName(data.name);
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error("Failed to load weather data");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const handleLocationChange = async (city: string) => {
    setLocationName(city);
    setIsLoadingWeather(true);
    try {
      const response = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();
      setWeather(data);
      setLocation({ lat: data.coord.lat, lon: data.coord.lon });
      toast.success(`Weather updated for ${city}`);
    } catch (error) {
      console.error("Error fetching weather:", error);
      toast.error("Failed to update weather");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    
    if (iconCode.includes('01')) return isDaytime ? <Sun className="h-16 w-16 opacity-80 animate-pulse" /> : <Sun className="h-16 w-16 opacity-60" />;
    if (iconCode.includes('02') || iconCode.includes('03')) return <CloudRain className="h-16 w-16 opacity-80" />;
    if (iconCode.includes('04')) return <CloudRain className="h-16 w-16 opacity-80" />;
    if (iconCode.includes('09') || iconCode.includes('10')) return <CloudRain className="h-16 w-16 opacity-80 animate-pulse" />;
    return <CloudRain className="h-16 w-16 opacity-80 animate-pulse" />;
  };

  const quickStats = [
    { label: "Active Fields", value: "04", helper: "+1.2% vs last week" },
    { label: "Open Tasks", value: "06", helper: "2 overdue" },
    { label: "Moisture Avg", value: "42%", helper: "Ideal range" },
    { label: "AI Insights", value: "3 new", helper: "Review required" },
  ];

  const upcomingTasks = [
    { time: "09:30", title: "Inspect Block A", detail: "Check pest traps" },
    { time: "12:15", title: "Irrigate Block C", detail: "18L / sq m" },
    { time: "16:00", title: "Soil sample", detail: "Send to lab" },
  ];

  const fieldInsights = [
    {
      title: "Beans • Block B",
      status: "Humidity spike detected",
      trend: "12% above norm",
    },
    {
      title: "Maize • Block A",
      status: "Nutrient drop",
      trend: "Nitrogen low",
    },
    { title: "Spinach • Tunnel", status: "Ready for harvest", trend: "Day 48" },
  ];

  const handleLogWater = () => {
    setIsLogWaterOpen(false);
    toast.success("Irrigation logged", {
      description: `Recorded ${waterAmount[0]} liters for Block A`,
    });
  };

  const handleUpdateCrop = () => {
    setIsCheckCropsOpen(false);
    toast.success("Crop status updated", {
      description: "Maize growth stage updated to Vegetative",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF3] via-[#F0FDF4] to-[#FEFCE8] pb-24">
      <Header />

      <main className="container px-4 py-6 space-y-8 max-w-7xl mx-auto">
        {/* Hero */}
        <section className="rounded-3xl bg-gradient-to-br from-[#E6FFEA] via-white to-[#FFF9DB] border-2 border-green-200/50 p-8 space-y-8 shadow-2xl shadow-green-100/50 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <Badge
                variant="outline"
                className="w-fit border-2 border-green-500 text-green-700 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all hover:scale-105 px-3 py-1.5"
              >
                <Clock className="h-3.5 w-3.5 mr-2" />
                <span className="font-semibold">Tuesday • Nairobi, KE</span>
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-serif text-green-900 font-bold tracking-tight">
                Jambo, Samuel 👋
              </h2>
              <p className="text-muted-foreground max-w-xl text-base leading-relaxed">
                Welcome to <span className="font-bold text-green-700">AgriVoice</span>, your AI-powered farming companion. 
                Your digital farm twin synced overnight. See where attention matters most.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/farm">
                <Button
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  Open Farm Timeline
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="secondary"
                className="border-2 border-amber-400 bg-white text-amber-700 hover:bg-amber-50 shadow-md hover:shadow-lg transition-all duration-300"
                size="lg"
                onClick={() => toast.info("Export feature coming soon!")}
              >
                Share Summary
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => (
              <Card
                key={stat.label}
                className="border-none bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wide text-gray-600 font-semibold">
                      {stat.label}
                    </p>
                    <TrendingUp className="h-4 w-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-4xl font-serif text-green-600 font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {stat.helper}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Alerts + Weather */}
        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Card className="bg-linear-to-br from-[#FFF7E0] to-[#FFEBB3] border-[#FFD447] shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 flex flex-col gap-5 md:flex-row md:items-center">
              <div className="p-4 rounded-2xl bg-white text-[#D97706] shadow-lg w-fit animate-pulse">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <div className="space-y-3 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#C17E00]">
                  Priority alert
                </p>
                <h3 className="text-2xl font-serif text-[#5B3B00] font-bold">
                  Dry spell incoming
                </h3>
                <p className="text-sm text-[#8A5B00] leading-relaxed">
                  Rainfall{" "}
                  <span className="font-bold text-[#C17E00]">-68%</span> below
                  weekly average. Schedule irrigation for Blocks A &amp; B
                  before 18:00.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-[#8A5B00] border-[#FFD447] shadow-sm"
                  >
                    3 affected fields
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-[#8A5B00] border-[#FFD447] shadow-sm"
                  >
                    AI recommendation ready
                  </Badge>
                </div>
              </div>
              <Button
                variant="link"
                className="px-0 text-[#8A5B00] font-semibold h-auto p-0 hover:text-[#C17E00] transition-colors group"
                onClick={() =>
                  toast.info("Recommendation: Irrigate 20L per sq meter")
                }
              >
                View plan{" "}
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="bg-linear-to-br from-[#1FAA59] to-[#18934B] text-white border-none shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                {isLoadingWeather ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin opacity-80" />
                  </div>
                ) : weather ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-1">
                        <p className="text-xs uppercase tracking-wide opacity-90 font-medium">
                          Weather pulse
                        </p>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 opacity-80" />
                          <span className="text-sm font-medium">{locationName}</span>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-white hover:bg-white/20 h-8"
                          >
                            Change
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Change Location</DialogTitle>
                            <DialogDescription>
                              Select a city to view its weather
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Select onValueChange={handleLocationChange} defaultValue={locationName}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select city" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Nairobi">Nairobi, Kenya</SelectItem>
                                <SelectItem value="Mombasa">Mombasa, Kenya</SelectItem>
                                <SelectItem value="Kisumu">Kisumu, Kenya</SelectItem>
                                <SelectItem value="Nakuru">Nakuru, Kenya</SelectItem>
                                <SelectItem value="Eldoret">Eldoret, Kenya</SelectItem>
                                <SelectItem value="Kampala">Kampala, Uganda</SelectItem>
                                <SelectItem value="Dar es Salaam">Dar es Salaam, Tanzania</SelectItem>
                                <SelectItem value="Kigali">Kigali, Rwanda</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-4xl font-serif font-bold">
                          {Math.round(weather.main.temp)}°C
                        </p>
                        <p className="text-sm opacity-90 capitalize">
                          {weather.weather[0].description} • Feels like {Math.round(weather.main.feels_like)}°
                        </p>
                      </div>
                      {getWeatherIcon(weather.weather[0].icon)}
                    </div>
                  </>
                ) : (
                  <p className="text-center py-8 opacity-80">Weather data unavailable</p>
                )}
              </CardContent>
            </Card>
            <div className="grid grid-cols-3 gap-3">
              <Card className="border-none bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 space-y-2 text-center">
                  <div className="p-2 rounded-lg bg-[#E6FFEA] w-fit mx-auto">
                    <Droplets className="h-5 w-5 text-[#1FAA59]" />
                  </div>
                  <p className="text-xs text-[#6B7280] font-medium">Humidity</p>
                  <p className="font-bold text-[#0F172A] text-lg">
                    {weather ? `${weather.main.humidity}%` : '—'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 space-y-2 text-center">
                  <div className="p-2 rounded-lg bg-[#E6FFEA] w-fit mx-auto">
                    <Wind className="h-5 w-5 text-[#1FAA59]" />
                  </div>
                  <p className="text-xs text-[#6B7280] font-medium">Wind</p>
                  <p className="font-bold text-[#0F172A] text-lg">
                    {weather ? `${Math.round(weather.wind.speed * 3.6)} km/h` : '—'}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none bg-white shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-4 space-y-2 text-center">
                  <div className="p-2 rounded-lg bg-[#FFF7E0] w-fit mx-auto">
                    <Sun className="h-5 w-5 text-[#FFB703]" />
                  </div>
                  <p className="text-xs text-[#6B7280] font-medium">Clouds</p>
                  <p className="font-bold text-[#0F172A] text-lg">
                    {weather ? `${weather.clouds.all}%` : '—'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Operations board */}
        <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-[#B4F0C3] shadow-lg shadow-green-100/50 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <CardContent className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-4 p-6 border-b border-[#ECFDF5]">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                    Operations board
                  </p>
                  <h3 className="text-2xl font-serif text-[#1B4332] font-bold">
                    Today&apos;s focus
                  </h3>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={isCheckCropsOpen}
                    onOpenChange={setIsCheckCropsOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-[#1FAA59] text-[#1FAA59] hover:bg-[#E6FFEA] hover:border-[#18934B] transition-all duration-200"
                      >
                        <Sprout className="mr-2 h-4 w-4" />
                        Update crops
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Update Crop Status</DialogTitle>
                        <DialogDescription>
                          Record the current progress of your crops.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="crop">Select Crop</Label>
                          <Select defaultValue="maize">
                            <SelectTrigger>
                              <SelectValue placeholder="Select crop" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="maize">
                                Maize (Block A)
                              </SelectItem>
                              <SelectItem value="beans">
                                Beans (Block B)
                              </SelectItem>
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
                              <SelectItem value="germination">
                                Germination
                              </SelectItem>
                              <SelectItem value="vegetative">
                                Vegetative
                              </SelectItem>
                              <SelectItem value="flowering">
                                Flowering
                              </SelectItem>
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
                  <Dialog
                    open={isLogWaterOpen}
                    onOpenChange={setIsLogWaterOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-[#1FAA59] text-white hover:bg-[#18934B] shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                      >
                        <Droplets className="mr-2 h-4 w-4" />
                        Log water
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Log Irrigation</DialogTitle>
                        <DialogDescription>
                          How much water did you apply today?
                        </DialogDescription>
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
                            <span className="w-12 text-right font-mono font-bold">
                              {waterAmount[0]}L
                            </span>
                          </div>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="method">Method</Label>
                          <Select defaultValue="drip">
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="drip">
                                Drip Irrigation
                              </SelectItem>
                              <SelectItem value="sprinkler">
                                Sprinkler
                              </SelectItem>
                              <SelectItem value="manual">
                                Manual / Can
                              </SelectItem>
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
              </div>

              <Separator />

              <div className="divide-y divide-[#ECFDF5]">
                {upcomingTasks.map((task, index) => (
                  <div
                    key={task.title}
                    className="flex items-center justify-between px-6 py-5 gap-4 hover:bg-[#F7FFF3] transition-colors duration-200 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-[#E6FFEA] text-[#1FAA59] font-mono text-sm font-semibold group-hover:bg-[#1FAA59] group-hover:text-white transition-all duration-200">
                        {task.time}
                      </div>
                      <div>
                        <p className="font-semibold text-[#0F172A] text-base">
                          {task.title}
                        </p>
                        <p className="text-sm text-[#708090] mt-0.5">
                          {task.detail}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#1FAA59] hover:bg-[#E9FCEB] hover:text-[#18934B] transition-all duration-200"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      Mark done
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#FFD447] bg-linear-to-br from-white to-[#FFF9DB]/30 shadow-lg shadow-yellow-100/50 hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#B7791F] font-medium">
                    Soil health
                  </p>
                  <h3 className="text-xl font-serif text-[#332600] font-bold">
                    Moisture &amp; nutrients
                  </h3>
                </div>
                <Link
                  href="/farm"
                  className="text-sm font-medium text-[#C2410C] hover:text-[#D97706] hover:underline transition-colors flex items-center gap-1"
                >
                  View report
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="grid gap-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-serif text-[#18934B] font-bold">
                    42%
                  </span>
                  <span className="text-sm text-[#6B7280] font-medium">
                    Average moisture
                  </span>
                </div>
                <div className="h-3 rounded-full bg-[#FFF1BF] overflow-hidden shadow-inner">
                  <div className="h-full bg-linear-to-r from-[#FFD447] to-[#FFB703] w-[68%] rounded-full transition-all duration-500" />
                </div>
                <div className="flex justify-between text-xs text-[#9CA3AF] font-medium">
                  <span>Dry</span>
                  <span>Optimal</span>
                  <span>Saturated</span>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 text-[#6B7280]">
                    <div className="p-2 rounded-lg bg-[#E6FFEA]">
                      <Thermometer className="h-4 w-4 text-[#1FAA59]" />
                    </div>
                    <span className="font-medium">Soil temperature</span>
                  </div>
                  <span className="font-bold text-[#0F172A]">19.4°C</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50 hover:bg-white transition-colors">
                  <div className="flex items-center gap-3 text-[#6B7280]">
                    <div className="p-2 rounded-lg bg-[#E6FFEA]">
                      <Leaf className="h-4 w-4 text-[#1FAA59]" />
                    </div>
                    <span className="font-medium">Nitrogen levels</span>
                  </div>
                  <span className="font-bold text-[#0F172A]">Medium</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-xs uppercase tracking-wide text-[#6B7280] font-medium">
                  Field insights
                </p>
                <div className="space-y-3">
                  {fieldInsights.map((insight) => (
                    <div
                      key={insight.title}
                      className="rounded-xl border border-[#FFE08A] bg-white/80 p-4 hover:bg-white hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <p className="text-sm font-semibold text-[#0F172A] mb-1">
                        {insight.title}
                      </p>
                      <p className="text-sm text-[#6B7280] mb-1">
                        {insight.status}
                      </p>
                      <p className="text-xs text-[#D97706] font-medium">
                        {insight.trend}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
