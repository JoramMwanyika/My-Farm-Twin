"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Html } from "@react-three/drei";
import * as THREE from "three";

// --- Types ---
interface FarmPlotProps {
    position: [number, number, number];
    width: number;
    depth: number;
    color: string;
    cropName: string;
    progress: number;
    onClick?: () => void;
}

interface FarmStructureProps {
    type: 'barn' | 'house' | 'greenhouse' | 'irrigation' | 'storage' | 'generator';
    position: [number, number, number];
    onClick?: () => void;
}

// --- Helper Functions ---
// --- Helper Functions ---
const getCropStyle = (cropName: string, progress: number) => {
    const name = cropName.toLowerCase();
    let stemColor = "#84cc16";
    let fruitColor = progress > 80 ? "#facc15" : "#4ade80"; // Default yellow/green

    if (name.includes('tomato') || name.includes('coffee') || name.includes('berry')) {
        fruitColor = progress > 70 ? "#ef4444" : "#86efac"; // Turn Red
    } else if (name.includes('maize') || name.includes('corn') || name.includes('wheat')) {
        stemColor = "#eab308"; // Golden stalk
        fruitColor = "#fef08a"; // Pale yellow top
    } else if (name.includes('bean') || name.includes('pea')) {
        fruitColor = progress > 60 ? "#8b5cf6" : "#4ade80"; // Purple/Green beans
    }

    return { stemColor, fruitColor };
};

const getColor = (colorName: string) => {
    switch (colorName) {
        case 'primary': return '#14532d'; // Eco Green
        case 'yellow': return '#f59e0b'; // Golden
        case 'brown': return '#3f2e18'; // Earthy
        case 'lightgreen': return '#86efac'; // Fresh Sprout
        case 'darkgreen': return '#064e3b'; // Deep Forest
        default: return '#14532d';
    }
};

// --- Components ---

export function Ground() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, -0.1, 10]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#3f2e18" roughness={1} />
        </mesh>
    );
}

const CropPlant = ({ position, progress, cropName }: { position: [number, number, number], progress: number, cropName: string }) => {
    // Determine scale based on progress (0-100)
    const scale = 0.2 + (progress / 100) * 0.8;
    const { stemColor, fruitColor } = getCropStyle(cropName, progress);

    return (
        <group position={position}>
            {/* Stem */}
            <mesh position={[0, scale / 2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, scale, 6]} />
                <meshStandardMaterial color={stemColor} />
            </mesh>
            {/* Foliage/Fruit */}
            <mesh position={[0, scale, 0]} castShadow>
                <dodecahedronGeometry args={[scale * 0.4, 0]} />
                <meshStandardMaterial color={fruitColor} />
            </mesh>
        </group>
    );
};

export function FarmPlot({ position, width, depth, color, cropName, progress, onClick }: FarmPlotProps) {
    const [hovered, setHover] = useState(false);

    // Calculate number of plants based on area
    const rows = Math.floor(depth * 1.5);
    const cols = Math.floor(width * 1.5);
    const plants = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            // Random offset for natural look
            const x = (j / cols) * width - width / 2 + 0.4;
            const z = (i / rows) * depth - depth / 2 + 0.4;
            plants.push(<CropPlant key={`${i}-${j}`} position={[x, 0, z]} progress={progress} cropName={cropName} />);
        }
    }

    return (
        <group position={position}>
            {/* Soil Base */}
            <mesh
                position={[0, 0.1, 0]}
                receiveShadow
                onClick={(e) => { e.stopPropagation(); onClick?.(); }}
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                <boxGeometry args={[width, 0.2, depth]} />
                <meshStandardMaterial
                    color={getColor(color)}
                    roughness={0.9}
                    emissive={hovered ? "#c0ff01" : "#000000"}
                    emissiveIntensity={hovered ? 0.2 : 0}
                />
            </mesh>

            {/* Plants */}
            {plants}

            {/* Label */}
            <Html position={[0, 1, 0]} center distanceFactor={10}>
                <div className={`px-2 py-1 rounded-md text-xs font-bold text-white shadow-md pointer-events-none whitespace-nowrap ${hovered ? 'bg-[#c0ff01] text-black scale-110' : 'bg-black/50'}`}>
                    {cropName} {progress}%
                </div>
            </Html>
        </group>
    );
}

export function FarmStructure({ type, position, onClick }: FarmStructureProps) {
    const [hovered, setHover] = useState(false);

    let geometry = <boxGeometry args={[2, 2, 2]} />;
    let color = "#ef4444"; // Default red

    switch (type) {
        case 'barn':
            color = "#b91c1c";
            break;
        case 'house':
            color = "#f5f5f5"; // White walls
            geometry = <boxGeometry args={[2, 1.5, 2]} />;
            break;
        case 'greenhouse':
            color = "#bae6fd"; // Light blue glass
            geometry = <cylinderGeometry args={[1.5, 1.5, 2, 8, 1, false, 0, Math.PI]} />;
            break;
        case 'irrigation':
            color = "#0ea5e9";
            geometry = <cylinderGeometry args={[0.5, 0.5, 3, 16]} />;
            break;
        case 'storage':
            color = "#78350f";
            geometry = <boxGeometry args={[1.5, 3, 1.5]} />;
            break;
        case 'generator':
            color = "#475569"; // Slate for generator
            geometry = <boxGeometry args={[2, 1.5, 1.2]} />;
            break;
    }

    return (
        <group position={position} onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
            {/* Main Body */}
            <mesh
                position={[0, type === 'generator' ? 0.75 : 1, 0]}
                castShadow
                receiveShadow
                onPointerOver={() => setHover(true)}
                onPointerOut={() => setHover(false)}
            >
                {geometry}
                <meshStandardMaterial
                    color={color}
                    transparent={type === 'greenhouse'}
                    opacity={type === 'greenhouse' ? 0.6 : 1}
                    emissive={hovered ? "#c0ff01" : "#000000"}
                    emissiveIntensity={hovered ? 0.2 : 0}
                />
            </mesh>

            {/* Details based on type */}
            {type !== 'greenhouse' && type !== 'irrigation' && type !== 'generator' && (
                <mesh position={[0, 2, 0]} rotation={[0, Math.PI / 4, 0]}>
                    <coneGeometry args={[1.5, 1, 4]} />
                    <meshStandardMaterial color={type === 'barn' ? '#7f1d1d' : type === 'house' ? '#334155' : '#333'} />
                </mesh>
            )}

            {/* Generator Details */}
            {type === 'generator' && (
                <group position={[0, 1.5, 0]}>
                    {/* Exhaust Pipe */}
                    <mesh position={[0.5, 0.2, 0]}>
                        <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
                        <meshStandardMaterial color="#1e293b" />
                    </mesh>
                    {/* Control Panel */}
                    <mesh position={[-0.8, -0.3, 0.61]}>
                        <boxGeometry args={[0.4, 0.6, 0.1]} />
                        <meshStandardMaterial color="#000" />
                    </mesh>
                </group>
            )}
        </group>
    );
}
