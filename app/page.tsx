"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, MapPin, Users, BookOpen, Search, Cloud, MessageSquare, BarChart3, Camera, Sun } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-lg shadow-md">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-green-900">AgriVoice</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#about" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                About Us
              </Link>
              <Link href="#features" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Features
              </Link>
              <Link href="#facilities" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Facilities
              </Link>
              <Link href="#campaigns" className="text-gray-700 hover:text-green-600 transition-colors font-medium">
                Campaigns
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                AI Key Resources for Your Good Garden
              </h1>
              <p className="text-lg md:text-xl text-green-50 leading-relaxed max-w-xl">
                Make your garden smarter by using cutting-edge AI technology. 
                Monitor, analyze and optimize your farm with AgriVoice.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <Link href="/register">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold shadow-xl hover:shadow-2xl transition-all text-lg px-8">
                    Start for Free
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20 backdrop-blur-sm">
                <Image
                  src="/community-farm.jpeg"
                  alt="Community farmers harvesting groundnuts"
                  width={800}
                  height={600}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Key Features of AgriVoice AI
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Empowering farmers with intelligent tools for better decision-making and sustainable farming
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Digital Farm Twin & Smart Analytics</h3>
                <p className="text-gray-300 leading-relaxed">
                  Create a virtual simulation of your entire farm with real-time data on soil conditions, crop health, and weather trends. Test decisions before implementing them and track performance history to learn from previous seasons.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">AI-Powered Image Analysis</h3>
                <p className="text-gray-300 leading-relaxed">
                  Simply upload photos of your soil and crops. Our AI instantly analyzes them to detect diseases, stress levels, soil quality, and provides treatment recommendations with health status and risk assessments.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Hyper-Local Weather Intelligence</h3>
                <p className="text-gray-300 leading-relaxed">
                  Get accurate micro-climate forecasts, rainfall predictions, and heat/drought alerts for your specific location. Receive automated reminders for irrigation, fertilizer application, and extreme weather via app, WhatsApp, SMS, or voice calls.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Multilingual Voice Assistant</h3>
                <p className="text-gray-300 leading-relaxed">
                  Ask questions and receive spoken explanations in Swahili, Sheng, and local languages. Get smart decision support on what to plant, when to irrigate, and fertilizer timing—making farming accessible even for low-literacy users.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why AgriVoice Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <Leaf className="h-4 w-4 text-green-700" />
                <span className="text-sm font-semibold text-green-700">Why Choose AgriVoice</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Farming Made Simple with AI Technology
              </h2>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                AgriVoice combines cutting-edge AI with local farming knowledge to help 
                you make smarter decisions, increase profits, and reduce losses—whether 
                you're a seasoned farmer or just starting out.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Camera className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Instant Crop Diagnosis</h4>
                    <p className="text-gray-600 text-sm">
                      Simply snap a photo and get AI-powered disease identification with 
                      treatment recommendations in seconds.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Cloud className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Hyper-Local Weather Alerts</h4>
                    <p className="text-gray-600 text-sm">
                      Receive micro-climate forecasts and automated alerts via app, WhatsApp, 
                      SMS, or voice calls.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <MessageSquare className="h-6 w-6 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Voice-Powered Assistant</h4>
                    <p className="text-gray-600 text-sm">
                      Get farming advice in Swahili or Sheng—no typing needed. Perfect for 
                      farmers with low literacy levels.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all mt-4">
                  Start Your Free Trial
                </Button>
              </Link>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-green-100">
                <Image
                  src="/chasing-green.jpeg"
                  alt="Successful farmers using AgriVoice technology"
                  width={700}
                  height={500}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
              
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-2xl p-6 border-2 border-green-200 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-700">10,000+</p>
                    <p className="text-sm text-gray-600">Active Farmers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Farmers Across East Africa
            </h2>
            <p className="text-gray-600 text-lg">
              Join thousands of farmers leveraging AI to increase yields, 
              reduce losses, and make data-driven farming decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  35% Yield Increase
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Farmers using AgriVoice's AI recommendations report an average 
                  35% increase in crop yields within the first season.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Early Disease Detection
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  AI-powered image analysis helps identify crop diseases up to 
                  2 weeks earlier, preventing widespread crop loss.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Sun className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Weather-Smart Planning
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Hyper-local forecasts and automated alerts help farmers plan 
                  irrigation, planting, and harvesting at optimal times.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Platform Capabilities Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Modern Farming
            </h2>
            <h3 className="text-2xl text-green-400 mb-4">
              Accessible Anytime, Anywhere
            </h3>
            <p className="text-gray-300 text-lg">
              AgriVoice works on any device with internet access. Get instant advice 
              through voice, text, or images—even in low-literacy environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all">
              <div className="bg-green-600 p-4 rounded-lg w-fit mb-4">
                <MessageSquare className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Voice-First Interface</h3>
              <p className="text-gray-300">
                Speak in Swahili or Sheng to get instant farming advice, 
                weather updates, and recommendations.
              </p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all">
              <div className="bg-green-600 p-4 rounded-lg w-fit mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Image Analysis</h3>
              <p className="text-gray-300">
                Take a photo of your crops or soil to receive AI-powered 
                diagnosis and treatment recommendations.
              </p>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-green-500 transition-all">
              <div className="bg-green-600 p-4 rounded-lg w-fit mb-4">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-Time Dashboard</h3>
              <p className="text-gray-300">
                Track your farm's performance, monitor weather patterns, 
                and visualize trends over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-green-600 to-green-700 p-2 rounded-lg">
                  <Leaf className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">AgriVoice</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered smart farming assistant for modern agriculture.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="#about" className="hover:text-green-400 transition-colors">About Us</Link></li>
                <li><Link href="#features" className="hover:text-green-400 transition-colors">Features</Link></li>
                <li><Link href="#campaigns" className="hover:text-green-400 transition-colors">Campaigns</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/login" className="hover:text-green-400 transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-green-400 transition-colors">Register</Link></li>
                <li><Link href="#" className="hover:text-green-400 transition-colors">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm">
                Email: info@agrivoice.com<br />
                Phone: +254 700 000 000
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 AgriVoice. All rights reserved. | <Link href="#" className="hover:text-green-400">Privacy Policy</Link></p>
          </div>
        </div>
      </footer>
    </div>
  );
}
