"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CloudRain,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Sprout,
  Wind,
  Sun,
  Thermometer,
  Clock,
  MapPin,
  Loader2,
  MessageSquare,
  Calendar as CalendarIcon,
  Users,
  Mic,
  Activity,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoadingWeather, setIsLoadingWeather] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationName, setLocationName] = useState("Nairobi");
  const [teamTasks, setTeamTasks] = useState<any[]>([]);
  const [calendarActivities, setCalendarActivities] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [farmBlocks, setFarmBlocks] = useState<any[]>([]);

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
    loadTeamData();
    loadCalendarData();
    loadFarmBlocks();
  }, []);

  const loadTeamData = () => {
    const tasksData = localStorage.getItem("farmTeamTasks");
    const logsData = localStorage.getItem("farmActivityLogs");
    
    if (tasksData) {
      setTeamTasks(JSON.parse(tasksData));
    }
    
    if (logsData) {
      const logs = JSON.parse(logsData);
      setRecentActivity(logs.slice(0, 5));
    }
  };

  const loadCalendarData = () => {
    const saved = localStorage.getItem("cropActivities");
    if (saved) {
      const activities = JSON.parse(saved);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const upcoming = activities
        .filter((a: any) => new Date(a.date) >= today)
        .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
      
      setCalendarActivities(upcoming);
    }
  };

  const loadFarmBlocks = () => {
    // Load from localStorage or use demo data
    const demoBlocks = [
      { id: 1, name: "Block A - Maize", healthStatus: "healthy", progress: 60 },
      { id: 2, name: "Block B - Beans", healthStatus: "warning", progress: 85 },
      { id: 3, name: "Greenhouse - Tomatoes", healthStatus: "healthy", progress: 45 },
    ];
    setFarmBlocks(demoBlocks);
  };

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
    { label: "Active Fields", value: "04", helper: "+1.2% vs last week", icon: Sprout },
    { label: "Team Tasks", value: teamTasks.filter((t: any) => t.status === 'pending').length.toString().padStart(2, '0'), helper: `${teamTasks.filter((t: any) => t.status === 'in-progress').length} in progress`, icon: Users },
    { label: "Next Activity", value: calendarActivities.length > 0 ? new Date(calendarActivities[0]?.date).getDate().toString().padStart(2, '0') : "--", helper: calendarActivities[0]?.activityType || "No upcoming", icon: CalendarIcon },
    { label: "Healthy Blocks", value: `${Math.round((farmBlocks.filter((b: any) => b.healthStatus === 'healthy').length / farmBlocks.length) * 100)}%`, helper: "AI status check", icon: Activity },
  ];

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
              <Link href="/advisor">
                <Button
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Ask AgriVoice
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
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
                    <Icon className="h-4 w-4 text-green-600" />
                  </div>
                  <p className="text-4xl font-serif text-green-600 font-bold">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {stat.helper}
                  </p>
                </CardContent>
              </Card>
              );
            })}
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

        {/* Quick Links & Features */}
        <section className="grid gap-6 lg:grid-cols-3">
          <Link href="/team" className="group">
            <Card className="border-2 border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-blue-700 group-hover:text-blue-800">
                  <Users className="h-6 w-6" />
                  <span>Team Collaboration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Manage tasks, assign work, and track team progress</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{teamTasks.filter((t: any) => t.status === 'pending').length} pending tasks</span>
                  <ArrowRight className="h-4 w-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/calendar" className="group">
            <Card className="border-2 border-purple-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-purple-700 group-hover:text-purple-800">
                  <CalendarIcon className="h-6 w-6" />
                  <span>Crop Calendar</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Track planting schedules and get AI reminders</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{calendarActivities.length} upcoming activities</span>
                  <ArrowRight className="h-4 w-4 text-purple-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/advisor" className="group">
            <Card className="border-2 border-green-200 hover:border-green-400 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full bg-gradient-to-br from-green-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-green-700 group-hover:text-green-800">
                  <MessageSquare className="h-6 w-6" />
                  <span>Ask AgriVoice AI</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">Get instant farming advice via voice or text</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Mic className="h-3 w-3 mr-1" />
                    Voice Ready
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </section>

        {/* Today's Highlights & Activity */}
        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Calendar Preview & Team Activity */}
          <div className="space-y-6">
            {/* Calendar Preview */}
            <Card className="border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-purple-600" />
                    Upcoming Activities
                  </CardTitle>
                  <Link href="/calendar">
                    <Button size="sm" variant="ghost" className="text-purple-600 hover:text-purple-700">
                      View All
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {calendarActivities.length > 0 ? (
                  <div className="space-y-3">
                    {calendarActivities.map((activity: any, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-colors">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-white text-purple-700 font-semibold border border-purple-200">
                          <span className="text-xs">{new Date(activity.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="text-lg">{new Date(activity.date).getDate()}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 capitalize">{activity.activityType}</p>
                          <p className="text-sm text-gray-600">{activity.cropType}</p>
                        </div>
                        {activity.reminderEnabled && (
                          <Badge variant="outline" className="text-xs">
                            🔔 {activity.reminderType}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No upcoming activities</p>
                    <Link href="/calendar">
                      <Button size="sm" variant="link" className="mt-2">
                        Add Activity
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Team Activity Feed */}
            <Card className="border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Recent Team Activity
                  </CardTitle>
                  <Link href="/team">
                    <Button size="sm" variant="ghost" className="text-blue-600 hover:text-blue-700">
                      View All
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((log: any, index: number) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          {log.action === 'assigned' && <Users className="h-4 w-4 text-blue-600" />}
                          {log.action === 'started' && <Clock className="h-4 w-4 text-orange-600" />}
                          {log.action === 'completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">{log.memberName}</span>{' '}
                            <span className="text-gray-600">{log.action}</span> a task
                          </p>
                          {log.details && (
                            <p className="text-xs text-gray-500 mt-0.5">{log.details}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No recent activity</p>
                    <Link href="/team">
                      <Button size="sm" variant="link" className="mt-2">
                        Add Team Members
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Farm Blocks Status */}
          <Card className="border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sprout className="h-5 w-5 text-green-600" />
                  Farm Blocks Status
                </CardTitle>
                <Link href="/farm">
                  <Button size="sm" variant="ghost" className="text-green-600 hover:text-green-700">
                    View All
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {farmBlocks.map((block: any) => (
                <div key={block.id} className="p-3 rounded-lg border-2 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{block.name}</span>
                    <Badge className={getHealthStatusColor(block.healthStatus)}>
                      {block.healthStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                        style={{ width: `${block.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{block.progress}%</span>
                  </div>
                </div>
              ))}

              {farmBlocks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Sprout className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No farm blocks yet</p>
                  <Link href="/farm">
                    <Button size="sm" variant="link" className="mt-2">
                      Add Blocks
                    </Button>
                  </Link>
                </div>
              )}

              {/* Today's Highlights - AI Summary */}
              <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-yellow-200">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-amber-800">
                  <TrendingUp className="h-4 w-4" />
                  Today's AI Highlights
                </h4>
                <ul className="space-y-2 text-sm text-amber-900">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>2 blocks in optimal health</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <span>Block B needs irrigation attention</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CalendarIcon className="h-4 w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                    <span>3 activities scheduled this week</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  );
}
