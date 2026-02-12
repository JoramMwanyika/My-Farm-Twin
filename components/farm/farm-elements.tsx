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

// High-contrast silhouettes for distinct crops
const MaizePlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.5 + (progress / 100) * 1.5; // Tallest crop
    return (
        <group position={position}>
            {/* Tall thick stalk */}
            <mesh position={[0, scale / 2, 0]} castShadow>
                <cylinderGeometry args={[0.04, 0.06, scale, 6]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            {/* Cone top (Tassel) - distinct silhouette */}
            <mesh position={[0, scale, 0]} castShadow>
                <coneGeometry args={[0.15, 0.5, 6]} />
                <meshStandardMaterial color={colors.fruit} />
            </mesh>
            {/* Side Leaves */}
            <mesh position={[0.15, scale * 0.5, 0]} rotation={[0, 0, -0.5]} castShadow>
                <boxGeometry args={[0.3, 0.05, 0.1]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            <mesh position={[-0.15, scale * 0.6, 0]} rotation={[0, 0, 0.5]} castShadow>
                <boxGeometry args={[0.3, 0.05, 0.1]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
        </group>
    );
};

const WheatPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.3 + (progress / 100);
    return (
        <group position={position}>
            {/* V-Shape / Fan silhouette - No central trunk */}
            <group rotation={[0.2, 0, 0]}>
                <mesh position={[0, scale / 2, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, scale, 4]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
                <mesh position={[0, scale, 0]} castShadow>
                    <coneGeometry args={[0.05, 0.2, 4]} />
                    <meshStandardMaterial color={colors.fruit} />
                </mesh>
            </group>
            <group rotation={[-0.2, 1, 0]} position={[0.05, 0, 0.05]}>
                <mesh position={[0, scale * 0.9 / 2, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, scale * 0.9, 4]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
                <mesh position={[0, scale * 0.9, 0]} castShadow>
                    <coneGeometry args={[0.05, 0.2, 4]} />
                    <meshStandardMaterial color={colors.fruit} />
                </mesh>
            </group>
            <group rotation={[0.2, -1, 0]} position={[-0.05, 0, -0.05]}>
                <mesh position={[0, scale * 0.8 / 2, 0]} castShadow>
                    <cylinderGeometry args={[0.01, 0.01, scale * 0.8, 4]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
                <mesh position={[0, scale * 0.8, 0]} castShadow>
                    <coneGeometry args={[0.05, 0.2, 4]} />
                    <meshStandardMaterial color={colors.fruit} />
                </mesh>
            </group>
        </group>
    );
};

const RootPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.2 + (progress / 100) * 0.5;
    return (
        <group position={position}>
            {/* Mound/Star shape on ground - Distinct low profile */}
            <mesh position={[0, scale * 0.3, 0]} castShadow>
                <octahedronGeometry args={[scale, 0]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            {/* Fruit peeking out */}
            {progress > 50 && (
                <mesh position={[0, 0.1, 0]} castShadow>
                    <dodecahedronGeometry args={[0.15, 0]} />
                    <meshStandardMaterial color={colors.fruit} />
                </mesh>
            )}
        </group>
    );
};


const SunflowerPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.5 + (progress / 100);
    return (
        <group position={position}>
            <mesh position={[0, scale / 2, 0]} castShadow>
                <cylinderGeometry args={[0.02, 0.02, scale, 6]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            {/* Flower Head - Flat disk */}
            <mesh position={[0.05, scale, 0.05]} rotation={[0.5, 0, 0]} castShadow>
                <cylinderGeometry args={[0.2, 0.2, 0.05, 8]} />
                <meshStandardMaterial color="#facc15" /> {/* Always Yellow */}
            </mesh>
            {/* Dark center */}
            <mesh position={[0.05, scale, 0.08]} rotation={[0.5, 0, 0]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.06, 8]} />
                <meshStandardMaterial color="#3f2e18" />
            </mesh>
        </group>
    );
};

const PumpkinPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.2 + (progress / 100) * 0.5;
    return (
        <group position={position}>
            {/* Ground Vines - Flat circle */}
            <mesh position={[0, 0.05, 0]} castShadow>
                <circleGeometry args={[scale, 8]} />
                <meshStandardMaterial color={colors.stem} side={THREE.DoubleSide} />
            </mesh>
            {/* The Pumpkin/Melon */}
            {progress > 30 && (
                <mesh position={[0, scale * 0.4, 0]} castShadow>
                    <sphereGeometry args={[scale * 0.5, 8, 8]} />
                    <meshStandardMaterial color={colors.fruit} />
                </mesh>
            )}
        </group>
    );
};

const ShrubPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.3 + (progress / 100) * 0.5;
    return (
        <group position={position}>
            {/* Main Bush */}
            <mesh position={[0, scale * 0.6, 0]} castShadow>
                <dodecahedronGeometry args={[scale, 0]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            {/* Berries scattered */}
            {progress > 50 && (
                <group>
                    <mesh position={[scale * 0.4, scale * 0.8, 0]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color={colors.fruit} /></mesh>
                    <mesh position={[-scale * 0.4, scale * 0.6, 0.2]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color={colors.fruit} /></mesh>
                    <mesh position={[0, scale * 0.9, -scale * 0.3]}><sphereGeometry args={[0.05]} /><meshStandardMaterial color={colors.fruit} /></mesh>
                </group>
            )}
        </group>
    );
};

const BananaPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.5 + (progress / 100) * 1.5;
    return (
        <group position={position}>
            {/* Thick Trunk */}
            <mesh position={[0, scale / 2, 0]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, scale, 6]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            {/* Drooping Leaves - Curved planes/boxes */}
            <group position={[0, scale * 0.8, 0]}>
                <mesh position={[0.3, 0.2, 0]} rotation={[0, 0, -0.5]}>
                    <boxGeometry args={[0.6, 0.02, 0.2]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
                <mesh position={[-0.3, 0.3, 0.1]} rotation={[0, 0, 0.5]}>
                    <boxGeometry args={[0.6, 0.02, 0.2]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
                <mesh position={[0, 0.25, -0.3]} rotation={[0.5, 0, 0]}>
                    <boxGeometry args={[0.2, 0.02, 0.6]} />
                    <meshStandardMaterial color={colors.stem} />
                </mesh>
            </group>
            {/* Banana Bunch */}
            {progress > 60 && (
                <mesh position={[0.1, scale * 0.7, 0.1]} rotation={[0, 0, -0.2]}>
                    <capsuleGeometry args={[0.05, 0.2, 4, 8]} />
                    <meshStandardMaterial color="#fef08a" />
                </mesh>
            )}
        </group>
    );
};

const GenericPlant = ({ position, progress, colors }: { position: [number, number, number], progress: number, colors: { stem: string, fruit: string } }) => {
    const scale = 0.2 + (progress / 100) * 0.8;
    return (
        <group position={position}>
            <mesh position={[0, scale / 2, 0]} castShadow>
                <cylinderGeometry args={[0.05, 0.05, scale, 6]} />
                <meshStandardMaterial color={colors.stem} />
            </mesh>
            <mesh position={[0, scale, 0]} castShadow>
                <dodecahedronGeometry args={[scale * 0.4, 0]} />
                <meshStandardMaterial color={colors.fruit} />
            </mesh>
        </group>
    );
};

const CropPlant = ({ position, progress, cropName, cropType }: { position: [number, number, number], progress: number, cropName: string, cropType?: string }) => {
    const { stemColor, fruitColor } = getCropStyle(cropType || cropName, progress);
    const colors = { stem: stemColor, fruit: fruitColor };

    // Use cropType if available, otherwise analyze cropName
    const typeKey = (cropType || cropName).toLowerCase();

    if (typeKey.includes('maize') || typeKey.includes('corn')) {
        return <MaizePlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('wheat') || typeKey.includes('rice') || typeKey.includes('grass') || typeKey.includes('barley')) {
        return <WheatPlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('potato') || typeKey.includes('carrot') || typeKey.includes('root') || typeKey.includes('onion') || typeKey.includes('beet')) {
        return <RootPlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('sunflower')) {
        return <SunflowerPlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('pumpkin') || typeKey.includes('melon') || typeKey.includes('squash') || typeKey.includes('watermelon')) {
        return <PumpkinPlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('coffee') || typeKey.includes('tea') || typeKey.includes('shrub') || typeKey.includes('bush') || typeKey.includes('berry')) {
        return <ShrubPlant position={position} progress={progress} colors={colors} />;
    }
    if (typeKey.includes('banana') || typeKey.includes('plantain') || typeKey.includes('palm')) {
        return <BananaPlant position={position} progress={progress} colors={colors} />;
    }

    return <GenericPlant position={position} progress={progress} colors={colors} />;
};

export function FarmPlot({ position, width, depth, color, cropName, cropType, progress, onClick }: FarmPlotProps & { cropType?: string }) {
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
            plants.push(<CropPlant key={`${i}-${j}`} position={[x, 0, z]} progress={progress} cropName={cropName} cropType={cropType} />);
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
