"use client";

import { Farm3DMap } from "@/components/farm-3d-map";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navigation, Layers, Compass } from "lucide-react";
import { motion } from "framer-motion";

export default function MapPage() {
    return (
        <div className="min-h-screen bg-[#f0efe9] pb-24 flex flex-col">
            <Header title="Farm 3D View" />

            <main className="flex-1 relative flex flex-col">
                {/* Map Container */}
                <div className="flex-1 relative w-full h-full min-h-[60vh]">
                    <Farm3DMap className="w-full h-full absolute inset-0" />

                    {/* Map Controls Overlay */}
                    <div className="absolute right-4 top-20 flex flex-col gap-3 z-20">
                        <Button size="icon" className="rounded-full bg-white text-gray-700 hover:bg-white/90 shadow-xl h-10 w-10">
                            <Compass className="h-5 w-5" />
                        </Button>
                        <Button size="icon" className="rounded-full bg-white text-gray-700 hover:bg-white/90 shadow-xl h-10 w-10">
                            <Layers className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Bottom Info Panel (Overlapping Map) */}
                <div className="px-4 -mt-6 relative z-10">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="bg-white/80 backdrop-blur-xl border border-white/20 p-5 rounded-3xl shadow-2xl"
                    >
                        <h3 className="font-serif text-xl font-bold text-[#0a1f16]">Digital Twin Active</h3>
                        <p className="text-sm text-gray-500 mt-1">Realtime satellite data sync enabled.</p>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-[#0a1f16]/5 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Lat</span>
                                <span className="text-sm font-bold text-[#0a1f16]">-1.2864</span>
                            </div>
                            <div className="bg-[#0a1f16]/5 p-3 rounded-xl flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-600">Lon</span>
                                <span className="text-sm font-bold text-[#0a1f16]">36.8172</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <BottomNav />
        </div>
    );
}
