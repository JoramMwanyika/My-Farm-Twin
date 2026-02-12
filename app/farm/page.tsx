"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sprout,
  Plus,
  Pencil,
  Trash2,
  Mic,
  Calendar,
  MoreHorizontal,
  LayoutGrid,
  Droplets,
  Sun,
  Wind,
  Thermometer,
  ArrowUpRight,
  Box,
  Map as MapIcon
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from 'next/dynamic';
import { updateBlockLayout, createBlock, deleteBlock } from '@/app/actions/farm';

const FarmScene = dynamic(() => import('@/components/farm/farm-scene').then(mod => mod.FarmScene), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-2xl"><p className="text-gray-500">Loading 3D World...</p></div>
});

type FarmBlock = {
  id: number | string; // Allow string IDs from DB
  cropName: string;
  cropType?: string; // Explicit crop variety
  blockName: string;
  color: string;
  progress: number;
  gridPosition: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
  structure: 'field' | 'barn' | 'house' | 'greenhouse' | 'irrigation' | 'storage' | 'generator';
  description?: string;
  sensorData?: {
    soilMoisture: number;
    temperature: number;
    humidity: number;
  };
  healthStatus?: 'healthy' | 'warning' | 'critical' | 'unknown'; // Updated to match DB
  predictedHarvest?: Date;
  voiceNotes?: Array<{
    id: string;
    timestamp: Date;
    duration: number;
    text: string;
  }>;
  photos?: Array<{
    id: string;
    url: string;
    timestamp: Date;
  }>;
};

const cropTypeOptions = [
  { value: "maize", label: "Maize / Corn" },
  { value: "wheat", label: "Wheat / Grain" },
  { value: "rice", label: "Rice" },
  { value: "potato", label: "Potato" },
  { value: "carrot", label: "Carrot" },
  { value: "sunflower", label: "Sunflower" },
  { value: "pumpkin", label: "Pumpkin / Melon" },
  { value: "coffee", label: "Coffee Shrub" },
  { value: "tea", label: "Tea Bush" },
  { value: "banana", label: "Banana / Plantain" },
  { value: "generic", label: "Other / Generic" },
];

const colorOptions = [
  {
    value: "primary",
    label: "Eco Green",
    bgClass: "bg-[#14532d] text-[#c0ff01]",
    borderClass: "border-[#14532d]",
    indicatorClass: "bg-[#c0ff01]"
  },
  {
    value: "yellow",
    label: "Golden Harvest",
    bgClass: "bg-amber-100 text-amber-900",
    borderClass: "border-amber-200",
    indicatorClass: "bg-amber-500"
  },
  {
    value: "brown",
    label: "Rich Soil",
    bgClass: "bg-[#3f2e18] text-[#f0efe9]", // Dark earthy brown
    borderClass: "border-[#3f2e18]",
    indicatorClass: "bg-[#d6cba8]"
  },
  {
    value: "lightgreen",
    label: "Fresh Sprout",
    bgClass: "bg-[#dcfce7] text-[#14532d]",
    borderClass: "border-[#86efac]",
    indicatorClass: "bg-[#22c55e]"
  },
  {
    value: "darkgreen",
    label: "Deep Forest",
    bgClass: "bg-[#0a1f16] text-white",
    borderClass: "border-[#0a1f16]",
    indicatorClass: "bg-[#4ade80]"
  },
];

const structureIcons: Record<string, string> = {
  field: "🌱",
  barn: "🏭",
  house: "🏡",
  greenhouse: "🌿",
  irrigation: "💧",
  storage: "📦",
  generator: "⚡",
};

const cropIcons: Record<string, string> = {
  maize: "🌽",
  wheat: "🌾",
  rice: "🍚",
  potato: "🥔",
  carrot: "🥕",
  sunflower: "🌻",
  pumpkin: "🎃",
  coffee: "☕",
  tea: "🍵",
  banana: "🍌",
  generic: "🌱",
};

export default function FarmTwinPage() {
  // ... (rest of component starts here)

  const [farmBlocks, setFarmBlocks] = useState<FarmBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [farmId, setFarmId] = useState<string | null>(null);

  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [editingBlock, setEditingBlock] = useState<FarmBlock | null>(null);
  const [newBlockName, setNewBlockName] = useState("");
  const [newCropName, setNewCropName] = useState("");
  const [newCropType, setNewCropType] = useState<string>("generic"); // Explicit crop variety
  const [newBlockColor, setNewBlockColor] = useState("primary");
  const [newStructureType, setNewStructureType] = useState<FarmBlock['structure']>('field');
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadFarmBlocks(), loadWeather()]);
    setLoading(false);
  };

  const loadFarmBlocks = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();

        if (data.farm) {
          setFarmId(data.farm.id);
        }

        if (data.blocks) {
          const mappedBlocks = data.blocks.map((b: any) => ({
            id: b.id,
            cropName: b.structure === 'field' ? (b.name.split(' ').length > 1 ? b.name : b.name) : b.name,
            cropType: b.cropType, // Map from DB
            blockName: b.name,
            color: b.color || 'primary',
            progress: b.progress,
            gridPosition: b.gridPosition || { row: 1, col: 1, rowSpan: 1, colSpan: 1 },
            structure: (b.structure as FarmBlock['structure']) || 'field',
            sensorData: (b.moisture !== '--') ? {
              soilMoisture: parseFloat(b.moisture),
              temperature: parseFloat(b.temp),
              humidity: 60 // Mock
            } : undefined,
            healthStatus: b.healthStatus,
          }));
          setFarmBlocks(mappedBlocks);
        }
      }
    } catch (error) {
      toast.error("Failed to load farm data");
      console.error(error);
    }
  };

  const loadWeather = async () => {
    try {
      const response = await fetch(`/api/weather?lat=-1.286389&lon=36.817223`);
      if (response.ok) {
        const data = await response.json();
        setWeather(data);
      }
    } catch (error) {
      console.error("Weather error:", error);
    }
  };

  const getColorClasses = (colorValue: string) => {
    return colorOptions.find((c) => c.value === colorValue) || colorOptions[0];
  };

  const inferStructure = (name: string): FarmBlock['structure'] => {
    const lower = name.toLowerCase();
    if (lower.includes('barn') || lower.includes('shed') || lower.includes('store')) return 'barn';
    if (lower.includes('greenhouse') || lower.includes('tunnel')) return 'greenhouse';
    if (lower.includes('house') || lower.includes('home') || lower.includes('cottage')) return 'house';
    if (lower.includes('pump') || lower.includes('water') || lower.includes('well')) return 'irrigation';
    if (lower.includes('silo') || lower.includes('tank')) return 'storage';
    if (lower.includes('generator') || lower.includes('power') || lower.includes('diesel') || lower.includes('electric')) return 'generator';
    if (lower.includes('maize') || lower.includes('bean') || lower.includes('crop') || lower.includes('field')) return 'field';
    return 'field'; // Default
  };

  const handleNameChange = (val: string) => {
    setNewBlockName(val);
    const inferred = inferStructure(val);
    if (inferred !== 'field') {
      setNewStructureType(inferred);
    }
  };

  const handleAddBlock = async () => {
    if (!newCropName.trim() && newStructureType === 'field') {
      toast.error("Please enter crop name");
      return;
    }
    if (!newBlockName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!farmId) {
      toast.error("Farm ID missing. Please refresh.");
      return;
    }

    const toastId = toast.loading("Creating block...");

    // Default position: find first empty spot or default
    // Simple grid finding logic (same as before)
    let row = 1, col = 1;
    let found = false;
    for (let r = 1; r <= 4; r++) {
      for (let c = 1; c <= 5; c++) {
        const occupied = farmBlocks.some(b =>
          b.gridPosition.row === r && b.gridPosition.col === c
        );
        if (!occupied) {
          row = r;
          col = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const newBlockData = {
      name: newBlockName,
      cropType: newCropType || newCropName.toLowerCase().split(' ')[0], // Explicit or infer simple
      structure: newStructureType,
      color: newBlockColor,
      gridRow: row,
      gridCol: col,
      gridRowSpan: 1,
      gridColSpan: 1
    };

    const result = await createBlock(farmId, newBlockData);

    if (result.success) {
      toast.dismiss(toastId);
      toast.success("Block created!");
      setAddBlockDialogOpen(false);
      // Reset form
      setNewCropName("");
      setNewBlockName("");
      setNewCropType("generic");
      setNewBlockColor("primary");
      setNewStructureType('field');
      // Reload
      loadFarmBlocks();
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to create block");
    }
  };

  const handleUpdateBlock = async () => {
    if (!editingBlock) return;

    const toastId = toast.loading("Saving changes...");

    const result = await updateBlockLayout(String(editingBlock.id), {
      gridRow: editingBlock.gridPosition.row,
      gridCol: editingBlock.gridPosition.col,
      gridRowSpan: editingBlock.gridPosition.rowSpan,
      gridColSpan: editingBlock.gridPosition.colSpan,
      color: editingBlock.color,
      structure: editingBlock.structure,
      cropType: editingBlock.cropType, // Pass explicitly
      description: editingBlock.description
    });

    if (result.success) {
      toast.dismiss(toastId);
      toast.success("Block updated!");
      setEditingBlock(null);
      // Reload to get fresh state
      loadFarmBlocks();
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to update block");
    }
  };

  const handleDeleteBlock = async (id: number | string) => {
    if (!confirm("Are you sure you want to delete this block?")) return;

    const toastId = toast.loading("Deleting...");
    const result = await deleteBlock(String(id));

    if (result.success) {
      toast.dismiss(toastId);
      toast.success("Block removed!");
      setFarmBlocks(farmBlocks.filter((block) => block.id !== id));
      setEditingBlock(null);
    } else {
      toast.dismiss(toastId);
      toast.error("Failed to delete block");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0efe9] pb-24">
      <Header title="My Farm" />

      <main className="container px-4 py-6 space-y-8 max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="rounded-3xl bg-[#0a1f16] text-white p-6 shadow-2xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#c0ff01]/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 w-fit">
                <Sprout className="h-4 w-4 text-[#c0ff01]" />
                <span className="text-xs font-semibold tracking-wide uppercase text-[#c0ff01]">Digital Twin Active</span>
              </div>
              <h2 className="text-4xl font-serif font-bold text-white leading-tight">
                Farm Status: <span className="text-[#c0ff01]">Optimal</span>
              </h2>
              <p className="text-gray-400 max-w-2xl text-sm leading-relaxed">
                Your digital farm twin is synced with live sensor data. AI analysis predicts a <span className="text-white font-medium">12% yield increase</span> this season based on current growth patterns.
              </p>
            </div>

            <div className="flex gap-3">
              <div className="bg-white/10 rounded-lg p-1 flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode('2d')}
                  className={`h-8 px-3 rounded-md transition-all ${viewMode === '2d' ? 'bg-white text-[#0a1f16]' : 'text-white hover:bg-white/20'}`}
                >
                  <LayoutGrid className="h-4 w-4 mr-2" />
                  2D Grid
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setViewMode('3d')}
                  className={`h-8 px-3 rounded-md transition-all ${viewMode === '3d' ? 'bg-[#c0ff01] text-[#0a1f16]' : 'text-white hover:bg-white/20'}`}
                >
                  <Box className="h-4 w-4 mr-2" />
                  3D World
                </Button>
              </div>

              {viewMode === '2d' && (
                <Button
                  onClick={() => setIsEditingLayout(!isEditingLayout)}
                  className={`transition-all bg-white/10 hover:bg-white/20 text-white border-none ${isEditingLayout ? 'ring-2 ring-[#c0ff01] bg-[#c0ff01]/20' : ''}`}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  {isEditingLayout ? 'Done' : 'Edit'}
                </Button>
              )}
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-8 border-t border-white/10">
            {[
              { label: "Active Area", value: "18.4 ha", icon: LayoutGrid },
              { label: "Avg Moisture", value: "44%", icon: Droplets },
              { label: "Alerts", value: "0", icon: Wind },
              { label: "Tasks Due", value: "7", icon: Calendar },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-gray-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">{stat.label}</p>
                  <p className="text-xl font-serif font-bold text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Farm Map Visualization */}
        {viewMode === '3d' ? (
          <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-xl bg-black/5">
            <FarmScene farmBlocks={farmBlocks} onBlockClick={setEditingBlock} />
          </div>
        ) : (
          <div className="relative w-full rounded-3xl border border-[#d1d5db] shadow-xl bg-white overflow-hidden">
            {/* Map Header */}
            <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20 pointer-events-none">
              <div className="flex flex-wrap gap-2 pointer-events-auto">
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#14532d]" /> Crops
                </div>
                <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#854d0e]" /> Structures
                </div>
              </div>

              {weather && (
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-gray-200 text-xs font-medium text-gray-700 flex items-center gap-3 pointer-events-auto">
                  <div className="flex items-center gap-1.5">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <span className="font-bold">{Math.round(weather.main.temp)}°C</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1.5">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{weather.main.humidity}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Isometric-ish Grid Container */}
            <div className="relative z-10 p-8 pt-16 min-h-[500px] bg-[url('/bg_mesh.png')] bg-cover bg-center">
              {/* Grid Background Pattern */}
              <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>

              <div className="grid grid-cols-5 grid-rows-4 gap-4 max-w-4xl mx-auto aspect-[5/4]">
                <AnimatePresence>
                  {farmBlocks.map((block) => {
                    const colors = getColorClasses(block.color);
                    let icon = structureIcons[block.structure] || structureIcons['field'];

                    if (block.structure === 'field') {
                      const typeKey = (block.cropType || block.cropName || "").toLowerCase();
                      const match = Object.keys(cropIcons).find(k => typeKey.includes(k));
                      if (match) {
                        icon = cropIcons[match];
                      }
                    }
                    return (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        key={block.id}
                        className={`${colors.bgClass} rounded-2xl border ${colors.borderClass} p-4 flex flex-col items-start justify-between relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-copy shadow-md`}
                        style={{
                          gridRow: `${block.gridPosition.row} / span ${block.gridPosition.rowSpan}`,
                          gridColumn: `${block.gridPosition.col} / span ${block.gridPosition.colSpan}`,
                        }}
                        onClick={() => isEditingLayout && setEditingBlock({ ...block })}
                      >
                        {/* Status Indicator */}
                        <div className="flex justify-between w-full items-start">
                          <div className={`h-2 w-2 rounded-full ${colors.indicatorClass} animate-pulse`} />
                          {block.healthStatus === 'warning' && (
                            <div className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-bold animate-pulse">!</div>
                          )}
                        </div>

                        <div className="mt-auto">
                          <div className="text-2xl mb-1">{icon}</div>
                          <p className="font-serif font-bold text-lg leading-none">{block.cropName}</p>
                          <p className="text-[10px] uppercase tracking-wider opacity-70 mt-1 font-medium">{block.blockName}</p>
                        </div>

                        {/* Interactive Overlay when NOT editing (Details) */}
                        {!isEditingLayout && (
                          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-2xl p-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center text-white z-10">
                            <p className="text-xs font-bold text-[#c0ff01] uppercase tracking-wider mb-2">Live Status</p>
                            {block.sensorData ? (
                              <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                  <span className="text-gray-400">Moisture</span>
                                  <span>{block.sensorData.soilMoisture}%</span>
                                </div>
                                <div className="flex justify-between border-b border-white/20 pb-1">
                                  <span className="text-gray-400">Temp</span>
                                  <span>{block.sensorData.temperature}°C</span>
                                </div>
                                {block.predictedHarvest && (
                                  <div className="pt-1">
                                    <span className="text-gray-400 block mb-0.5">Harvest</span>
                                    <span className="font-bold">{block.predictedHarvest.toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-xs text-gray-400">No sensor data connected.</p>
                            )}

                            <Button variant="outline" size="sm" className="w-full mt-3 h-7 text-xs bg-transparent border-white/30 text-white hover:bg-white hover:text-black">
                              View Details
                            </Button>
                          </div>
                        )}

                        {/* Editing Overlay */}
                        {isEditingLayout && (
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 z-20">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-black/5 rounded-full" onClick={(e) => { e.stopPropagation(); setEditingBlock(block); }}>
                              <Pencil className="h-4 w-4 text-gray-600" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50 rounded-full" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>

                {/* Add Block Button */}
                {isEditingLayout && (
                  <Dialog open={addBlockDialogOpen} onOpenChange={setAddBlockDialogOpen}>
                    <DialogTrigger asChild>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-[#c0ff01] hover:bg-[#c0ff01]/5 transition-all group col-span-1 row-span-1"
                      >
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#c0ff01] transition-colors">
                          <Plus className="h-5 w-5 text-gray-400 group-hover:text-[#0a1f16]" />
                        </div>
                        <span className="text-xs font-bold text-gray-400 mt-2 group-hover:text-[#0a1f16]">Add Block</span>
                      </motion.button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle className="font-serif text-2xl">Add New Farm Block</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Block Name</Label>
                          <Input value={newBlockName} onChange={(e) => handleNameChange(e.target.value)} placeholder="e.g. North Barn" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Structure Type</Label>
                          <Select value={newStructureType} onValueChange={(val: any) => setNewStructureType(val)}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="field">Crop Field</SelectItem>
                              <SelectItem value="barn">Barn / Shed</SelectItem>
                              <SelectItem value="greenhouse">Greenhouse</SelectItem>
                              <SelectItem value="house">Farm House</SelectItem>
                              <SelectItem value="irrigation">Irrigation / Pump</SelectItem>
                              <SelectItem value="storage">Storage / Silo</SelectItem>
                              <SelectItem value="generator">Generator</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        {newStructureType === 'field' && (
                          <>
                            <div className="grid gap-2">
                              <Label>Crop Variety</Label>
                              <Select value={newCropType} onValueChange={setNewCropType}>
                                <SelectTrigger><SelectValue placeholder="Select crop type" /></SelectTrigger>
                                <SelectContent>
                                  {cropTypeOptions.map((c) => (
                                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-2">
                              <Label>Block Name / Label</Label>
                              <Input value={newCropName} onChange={(e) => setNewCropName(e.target.value)} placeholder="e.g. Field 1" />
                            </div>
                          </>
                        )}
                        <div className="grid gap-2">
                          <Label>Theme Color</Label>
                          <Select value={newBlockColor} onValueChange={setNewBlockColor}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddBlock} className="bg-green-700 hover:bg-green-800 text-white">Add Block</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Helper text */}
        <div className="text-center text-xs text-gray-500">
          <p>Tip: Enable "<span className="font-semibold text-gray-700">Edit Layout</span>" to rearrange your digital twin to match your real farm.</p>
        </div>

        {/* Edit Block Dialog */}
        <Dialog open={!!editingBlock} onOpenChange={(open) => !open && setEditingBlock(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">Edit Block Details</DialogTitle>
            </DialogHeader>
            {editingBlock && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Row</Label>
                    <Input type="number" value={editingBlock.gridPosition.row} onChange={(e) => setEditingBlock({ ...editingBlock, gridPosition: { ...editingBlock.gridPosition, row: parseInt(e.target.value) } })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Col</Label>
                    <Input type="number" value={editingBlock.gridPosition.col} onChange={(e) => setEditingBlock({ ...editingBlock, gridPosition: { ...editingBlock.gridPosition, col: parseInt(e.target.value) } })} />
                  </div>
                </div>

                <div className="space-y-4 border-t pt-4 border-gray-200">
                  <h4 className="font-semibold text-sm">Size & Coverage</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Width (Col Span)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="5"
                          value={editingBlock.gridPosition.colSpan}
                          onChange={(e) => setEditingBlock({ ...editingBlock, gridPosition: { ...editingBlock.gridPosition, colSpan: parseInt(e.target.value) || 1 } })}
                        />
                        <span className="text-xs text-gray-500 whitespace-nowrap">columns</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Depth (Row Span)</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="1"
                          max="4"
                          value={editingBlock.gridPosition.rowSpan}
                          onChange={(e) => setEditingBlock({ ...editingBlock, gridPosition: { ...editingBlock.gridPosition, rowSpan: parseInt(e.target.value) || 1 } })}
                        />
                        <span className="text-xs text-gray-500 whitespace-nowrap">rows</span>
                      </div>
                    </div>
                  </div>

                  {/* Coverage Calc */}
                  <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-900">Total Coverage</span>
                    <span className="text-lg font-bold text-blue-700">
                      {Math.round(((editingBlock.gridPosition.colSpan * editingBlock.gridPosition.rowSpan) / 20) * 100)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Structure Type</Label>
                  <Select value={editingBlock.structure} onValueChange={(val: any) => setEditingBlock({ ...editingBlock, structure: val })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="field">Crop Field</SelectItem>
                      <SelectItem value="barn">Barn / Shed</SelectItem>
                      <SelectItem value="greenhouse">Greenhouse</SelectItem>
                      <SelectItem value="house">Farm House</SelectItem>
                      <SelectItem value="irrigation">Irrigation / Pump</SelectItem>
                      <SelectItem value="storage">Storage / Silo</SelectItem>
                      <SelectItem value="generator">Generator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {editingBlock.structure === 'field' && (
                  <>
                    <div className="space-y-2">
                      <Label>Crop Variety</Label>
                      <Select value={editingBlock.cropType || "generic"} onValueChange={(val) => setEditingBlock({ ...editingBlock, cropType: val })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {cropTypeOptions.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Block Label</Label>
                      <Input value={editingBlock.cropName} onChange={(e) => setEditingBlock({ ...editingBlock, cropName: e.target.value })} />
                    </div>
                  </>
                )}
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={editingBlock.description || ''} onChange={(e) => setEditingBlock({ ...editingBlock, description: e.target.value })} placeholder="Add notes..." />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={handleUpdateBlock} className="bg-primary text-primary-foreground">Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <BottomNav />
      </main >
    </div >
  );
}
