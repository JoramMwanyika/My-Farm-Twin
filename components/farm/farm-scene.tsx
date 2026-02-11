"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, MapControls, Stars, Sky, Environment, Detailed } from "@react-three/drei";
import { FarmPlot, FarmStructure, Ground } from "./farm-elements";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, CloudRain, Wind } from "lucide-react";

interface FarmSceneProps {
    farmBlocks: any[];
    onBlockClick?: (block: any) => void;
}

export function FarmScene({ farmBlocks, onBlockClick }: FarmSceneProps) {
    const [weather, setWeather] = useState<'sunny' | 'night' | 'rain'>('sunny');

    return (
        <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/20">
            {/* Weather Controls Overlay */}
            <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-black/20 backdrop-blur-md p-2 rounded-xl">
                <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 rounded-lg ${weather === 'sunny' ? 'bg-[#c0ff01] text-black' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setWeather('sunny')}
                    title="Sunny Day"
                >
                    <Sun className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 rounded-lg ${weather === 'night' ? 'bg-indigo-500 text-white' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setWeather('night')}
                    title="Night Mode"
                >
                    <Moon className="h-4 w-4" />
                </Button>
                <Button
                    size="icon"
                    variant="ghost"
                    className={`h-8 w-8 rounded-lg ${weather === 'rain' ? 'bg-blue-500 text-white' : 'text-white hover:bg-white/10'}`}
                    onClick={() => setWeather('rain')}
                    title="Rain Simulation"
                >
                    <CloudRain className="h-4 w-4" />
                </Button>
            </div>

            <Canvas shadows camera={{ position: [10, 10, 10], fov: 45 }}>
                <Suspense fallback={null}>
                    {/* Lighting & Environment */}
                    <ambientLight intensity={weather === 'night' ? 0.2 : 0.7} />
                    <directionalLight
                        position={[10, 20, 10]}
                        intensity={weather === 'night' ? 0.1 : 1.5}
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />

                    {weather === 'sunny' && <Sky sunPosition={[100, 20, 100]} turbidity={0.5} rayleigh={0.5} />}
                    {weather === 'night' && <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />}
                    {weather === 'rain' && <Environment preset="city" />} {/* Simple environment for reflection in rain */}

                    {/* Controls */}
                    <MapControls
                        enableDamping
                        dampingFactor={0.05}
                        minDistance={5}
                        maxDistance={50}
                        maxPolarAngle={Math.PI / 2.5} // Don't allow going under the ground
                    />

                    {/* Scene Content */}
                    <group position={[-5, 0, -5]}> {/* Center standard grid roughly */}
                        <Ground />

                        {farmBlocks.map((block) => (
                            <group key={block.id}>
                                {block.structure === 'field' && (
                                    <FarmPlot
                                        position={[block.gridPosition.col * 2.2, 0, block.gridPosition.row * 2.2]}
                                        width={block.gridPosition.colSpan * 2}
                                        depth={block.gridPosition.rowSpan * 2}
                                        color={block.color}
                                        cropName={block.cropName}
                                        progress={block.progress}
                                        onClick={() => onBlockClick?.(block)}
                                    />
                                )}
                                {block.structure !== 'field' && (
                                    <FarmStructure
                                        type={block.structure}
                                        position={[block.gridPosition.col * 2.2, 0, block.gridPosition.row * 2.2]}
                                        onClick={() => onBlockClick?.(block)}
                                    />
                                )}
                            </group>
                        ))}
                    </group>

                    {/* Grid Helper for reference */}
                    <gridHelper args={[50, 50, 0xffffff, 0x555555]} position={[0, -0.01, 0]} />
                </Suspense>
            </Canvas>
        </div>
    );
}
