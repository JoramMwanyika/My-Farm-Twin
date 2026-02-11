"use client";

import { useEffect, useState, useCallback } from "react";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { Loader2, Search, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Farm3DMapProps {
    apiKey?: string;
    mapId?: string;
    className?: string;
}

// Internal component to handle map interactions
function MapHandler({ place, onLocationSelect }: { place: { lat: number; lng: number } | null, onLocationSelect?: (lat: number, lng: number) => void }) {
    const map = useMap();

    useEffect(() => {
        if (!map || !place) return;

        map.panTo(place);
        map.setZoom(18);
        map.setTilt(67.5);
        map.setHeading(0);

        if (onLocationSelect) {
            onLocationSelect(place.lat, place.lng);
        }

    }, [map, place, onLocationSelect]);

    return null;
}

export function Farm3DMap({ apiKey, mapId, className }: Farm3DMapProps) {
    const [key, setKey] = useState<string>("");
    const [id, setId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        const k = apiKey || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
        const m = mapId || process.env.NEXT_PUBLIC_GOOGLE_MAP_ID || "";
        setKey(k);
        setId(m);
    }, [apiKey, mapId]);

    const handleSearch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            // Use existing weather API for simple geocoding
            const res = await fetch(`/api/weather?city=${encodeURIComponent(searchQuery)}`);
            if (res.ok) {
                const data = await res.json();
                if (data.coord) {
                    setSelectedLocation({ lat: data.coord.lat, lng: data.coord.lon });
                    toast.success(`Found location: ${data.name}`);
                } else {
                    toast.error("Location not found");
                }
            } else {
                toast.error("Search failed");
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Something went wrong");
        } finally {
            setIsSearching(false);
        }
    };

    if (!key) {
        return (
            <div className={`flex items-center justify-center bg-gray-100 rounded-2xl ${className}`}>
                <div className="text-center p-6">
                    <p className="text-red-500 font-bold mb-2">API Key Missing</p>
                    <p className="text-xs text-gray-500">Please configure NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env</p>
                </div>
            </div>
        );
    }

    return (
        <APIProvider apiKey={key}>
            <div className={`relative overflow-hidden rounded-2xl ${className} group`}>
                <Map
                    defaultCenter={{ lat: -1.286389, lng: 36.817223 }} // Nairobi Default
                    defaultZoom={18}
                    defaultHeading={0}
                    defaultTilt={67.5}
                    mapId={id}
                    mapTypeId={"hybrid"}
                    disableDefaultUI={true}
                    gestureHandling={"greedy"}
                    reuseMaps={true}
                    style={{ width: "100%", height: "100%" }}
                >
                    <MapHandler place={selectedLocation} />
                </Map>

                {/* Search Bar Overlay */}
                <div className="absolute top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 z-10">
                    <form onSubmit={handleSearch} className="relative">
                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search location (e.g. Eldoret, Kenya)..."
                            className="pl-10 h-10 bg-white/90 backdrop-blur-md border-0 shadow-lg rounded-full"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1 top-1 h-8 w-8 rounded-full bg-[#c0ff01] hover:bg-[#b0ef00] text-black"
                            disabled={isSearching}
                        >
                            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
                        </Button>
                    </form>
                </div>

                {/* Status Indicator */}
                <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] font-bold text-gray-800 uppercase tracking-wide">Live Satellite</span>
                    </div>
                </div>
            </div>
        </APIProvider>
    );
}
