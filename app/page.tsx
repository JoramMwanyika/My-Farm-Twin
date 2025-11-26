"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, MapPin, Users, BookOpen, Search } from "lucide-react";
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
                <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Leaf className="h-32 w-32 text-white/30" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Customized Location Tracker
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Find out a Community Garden</h3>
                <p className="text-gray-300 leading-relaxed">
                  Locate community gardens near you and connect with local farmers using our advanced mapping technology.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Search className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Virtual GPS & Community Gardens</h3>
                <p className="text-gray-300 leading-relaxed">
                  Navigate to gardens with precision GPS tracking and discover community farming opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Your Community Garden</h3>
                <p className="text-gray-300 leading-relaxed">
                  Create and manage your own community garden space with AI-powered insights and recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                  <Users className="h-32 w-32 text-green-600/30" />
                </div>
              </div>
              
              <Card className="absolute -bottom-6 -right-6 bg-green-700 text-white border-none shadow-xl max-w-xs">
                <CardContent className="p-6">
                  <p className="text-sm font-medium mb-2">Easy for New Gardeners</p>
                  <p className="text-xs text-green-100">
                    AI-guided farming makes it simple for beginners to start their journey.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <Leaf className="h-4 w-4 text-green-700" />
                <span className="text-sm font-semibold text-green-700">Welcome to AgriVoice</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Welcome your Community Garden
              </h2>
              
              <p className="text-gray-600 leading-relaxed text-lg">
                Join a thriving community of farmers and gardeners. Share knowledge, 
                resources, and harvests with your neighbors while leveraging AI technology 
                to maximize your yield.
              </p>

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Learn & Grow Together</h4>
                    <p className="text-gray-600 text-sm">
                      Access educational resources and expert advice from experienced farmers.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Users className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Connect with Community</h4>
                    <p className="text-gray-600 text-sm">
                      Network with local farmers and share your success stories.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all mt-4">
                  Sign Up Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Community Garden Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-green-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Community Garden
            </h2>
            <p className="text-gray-600 text-lg">
              Experience the future of farming with AI-powered insights, 
              real-time monitoring, and community support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  AI-Powered Farm Analysis
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Get real-time insights about soil health, crop conditions, 
                  and weather patterns using advanced AI technology.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-200 hover:border-green-400 transition-all hover:shadow-xl">
              <CardContent className="p-8 space-y-4">
                <div className="bg-green-600 p-4 rounded-lg w-fit">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Digital Farm Twin
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Visualize your entire farm in a digital replica, track progress, 
                  and plan your activities with precision.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Gared's Services
            </h2>
            <h3 className="text-2xl text-green-400 mb-4">
              Customized Location Tracker
            </h3>
            <p className="text-gray-300 text-lg">
              Track your garden's location for easy coordination with the community. 
              Share resources, harvest times, and collaborate effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <MapPin className="h-24 w-24 text-white/30" />
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center">
                <Leaf className="h-24 w-24 text-white/30" />
              </div>
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
