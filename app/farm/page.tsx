"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Map,
  BarChart3,
  Sprout,
  Calendar,
  Plus,
  Check,
  Pencil,
  Trash2,
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

type FarmBlock = {
  id: number;
  cropName: string;
  blockName: string;
  color: string;
  progress: number;
  gridPosition: {
    row: number;
    col: number;
    rowSpan: number;
    colSpan: number;
  };
  structure: 'field' | 'barn' | 'house' | 'greenhouse' | 'irrigation' | 'storage';
  description?: string;
};

const colorOptions = [
  {
    value: "primary",
    label: "Green",
    bgClass: "bg-gradient-to-br from-green-600/30 to-green-700/20",
    borderClass: "border-green-600",
    textClass: "text-green-900",
    pattern: "field",
  },
  {
    value: "yellow",
    label: "Golden",
    bgClass: "bg-gradient-to-br from-yellow-600/30 to-yellow-700/20",
    borderClass: "border-yellow-600",
    textClass: "text-yellow-900",
    pattern: "field",
  },
  {
    value: "brown",
    label: "Brown",
    bgClass: "bg-gradient-to-br from-amber-800/40 to-amber-900/30",
    borderClass: "border-amber-800",
    textClass: "text-amber-950",
    pattern: "plowed",
  },
  {
    value: "lightgreen",
    label: "Light Green",
    bgClass: "bg-gradient-to-br from-lime-500/30 to-lime-600/20",
    borderClass: "border-lime-600",
    textClass: "text-lime-900",
    pattern: "field",
  },
  {
    value: "darkgreen",
    label: "Dark Green",
    bgClass: "bg-gradient-to-br from-emerald-800/40 to-emerald-900/30",
    borderClass: "border-emerald-800",
    textClass: "text-emerald-950",
    pattern: "dense",
  },
];

const structureIcons = {
  field: "🌾",
  barn: "🏚️",
  house: "🏠",
  greenhouse: "🏡",
  irrigation: "💧",
  storage: "📦",
};

const snapshotStats = [
  { title: "Farm Area", value: "18.4 ha", helper: "+0.6 ha vs last year" },
  { title: "Avg. Moisture", value: "44%", helper: "Optimal range" },
  { title: "Upcoming Tasks", value: "07", helper: "3 due today" },
  { title: "Healthy Blocks", value: "92%", helper: "AI status check" },
];

export default function FarmTwinPage() {
  const [farmBlocks, setFarmBlocks] = useState<FarmBlock[]>([
    {
      id: 1,
      cropName: "Maize",
      blockName: "Block A",
      color: "primary",
      progress: 60,
      gridPosition: { row: 1, col: 1, rowSpan: 2, colSpan: 2 },
      structure: "field",
    },
    {
      id: 2,
      cropName: "Beans",
      blockName: "Block B",
      color: "yellow",
      progress: 85,
      gridPosition: { row: 1, col: 3, rowSpan: 1, colSpan: 2 },
      structure: "field",
    },
    {
      id: 3,
      cropName: "Storage",
      blockName: "Barn",
      color: "brown",
      progress: 100,
      gridPosition: { row: 3, col: 1, rowSpan: 1, colSpan: 1 },
      structure: "barn",
    },
    {
      id: 4,
      cropName: "Greenhouse",
      blockName: "Tomatoes",
      color: "lightgreen",
      progress: 45,
      gridPosition: { row: 2, col: 3, rowSpan: 2, colSpan: 2 },
      structure: "greenhouse",
    },
    {
      id: 5,
      cropName: "Irrigation",
      blockName: "Water System",
      color: "darkgreen",
      progress: 100,
      gridPosition: { row: 3, col: 2, rowSpan: 1, colSpan: 1 },
      structure: "irrigation",
    },
  ]);

  const [isEditingLayout, setIsEditingLayout] = useState(false);
  const [editingBlock, setEditingBlock] = useState<FarmBlock | null>(null);
  const [newBlockName, setNewBlockName] = useState("");
  const [newCropName, setNewCropName] = useState("");
  const [newBlockColor, setNewBlockColor] = useState("primary");
  const [addBlockDialogOpen, setAddBlockDialogOpen] = useState(false);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Apply Fertilizer",
      subtitle: "Block A - Maize",
      date: "24",
      month: "Nov",
      color: "secondary",
    },
    {
      id: 2,
      title: "Irrigation Scheduled",
      subtitle: "All Blocks - 20 mins",
      date: "25",
      month: "Nov",
      color: "blue-50",
    },
  ]);

  const completeTask = (id: number) => {
    setTasks(tasks.filter((t) => t.id !== id));
    toast.success("Task completed!");
  };

  const getColorClasses = (colorValue: string) => {
    return colorOptions.find((c) => c.value === colorValue) || colorOptions[0];
  };

  const handleAddBlock = () => {
    if (!newCropName.trim() || !newBlockName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    // Find an available grid position
    const newBlock: FarmBlock = {
      id: Date.now(),
      cropName: newCropName,
      blockName: newBlockName,
      color: newBlockColor,
      progress: 0,
      gridPosition: { row: 4, col: 4, rowSpan: 1, colSpan: 1 }, // Default position
      structure: 'field',
    };
    setFarmBlocks([...farmBlocks, newBlock]);
    setNewCropName("");
    setNewBlockName("");
    setNewBlockColor("primary");
    setAddBlockDialogOpen(false);
    toast.success(`${newBlockName} added!`);
  };

  const handleUpdateBlock = () => {
    if (!editingBlock) return;
    setFarmBlocks(
      farmBlocks.map((block) =>
        block.id === editingBlock.id ? editingBlock : block
      )
    );
    setEditingBlock(null);
    toast.success("Block updated!");
  };

  const handleDeleteBlock = (id: number) => {
    setFarmBlocks(farmBlocks.filter((block) => block.id !== id));
    toast.success("Block removed!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7FFF3] via-[#F0FDF4] to-[#FEFCE8] pb-24">
      <Header title="My Farm" />

      <main className="container px-4 py-6 space-y-8">
        <section className="rounded-3xl bg-gradient-to-br from-[#E6FFEA] via-white to-[#FFF9DB] border-2 border-green-200 p-6 shadow-2xl shadow-green-100/50 space-y-6 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-bold tracking-wide uppercase text-green-600 flex items-center gap-2">
                <Sprout className="h-4 w-4" />
                Digital Farm Twin
              </p>
              <h2 className="text-3xl font-serif text-green-900 font-bold">
                Your fields are synced and healthy
              </h2>
              <p className="text-sm text-gray-700 max-w-2xl leading-relaxed">
                Monitor crop layout, soil health, and daily tasks. Powered by <span className="font-bold text-green-700">AgriVoice</span> AI insights.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Export Snapshot
              </Button>
              <Button
                variant="secondary"
                className="border-2 border-amber-400 text-amber-700 bg-white hover:bg-amber-50 shadow-md hover:shadow-lg transition-all"
              >
                Share Access
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {snapshotStats.map((stat) => (
              <Card
                key={stat.title}
                className="border-none shadow-[0_10px_30px_rgba(34,197,94,0.08)]"
              >
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs uppercase tracking-wide text-[#6B7280]">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-serif text-[#15803D]">
                    {stat.value}
                  </p>
                  <p className="text-xs text-[#94A3B8]">{stat.helper}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Farm Map Visualization */}
        <div className="relative w-full rounded-3xl border-2 border-green-300 shadow-2xl shadow-green-500/20 bg-gradient-to-br from-[#2D5016] via-[#3A6B1F] to-[#2D5016]">
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:40px_40px]"></div>
          
          {/* Legend */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-green-900 shadow-lg border border-green-300">
              <span className="h-2.5 w-2.5 rounded-full bg-green-600" /> Crops
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-amber-900 shadow-lg border border-amber-300">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-700" /> Buildings
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-bold text-blue-900 shadow-lg border border-blue-300">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-600" /> Infrastructure
            </span>
          </div>

          {/* Realistic grid-based farm layout */}
          <div className="relative z-10 p-8 rounded-3xl overflow-hidden">
            <div className="grid grid-cols-5 grid-rows-4 gap-2 max-w-4xl mx-auto aspect-[5/4]">
              {farmBlocks.map((block) => {
                const colors = getColorClasses(block.color);
                const icon = structureIcons[block.structure];
                return (
                  <div
                    key={block.id}
                    className={`${colors.bgClass} border-2 ${colors.borderClass} rounded-lg p-3 flex flex-col items-center justify-center relative group transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer backdrop-blur-sm`}
                    style={{
                      gridRow: `${block.gridPosition.row} / span ${block.gridPosition.rowSpan}`,
                      gridColumn: `${block.gridPosition.col} / span ${block.gridPosition.colSpan}`,
                    }}
                  >
                    {/* Pattern overlay based on crop type */}
                    {block.structure === 'field' && (
                      <div className="absolute inset-0 opacity-30 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,currentColor_8px,currentColor_9px)] rounded-lg"></div>
                    )}
                    
                    {/* Edit overlay */}
                    {isEditingLayout && (
                      <div className="absolute inset-0 bg-black/60 rounded-lg flex items-center justify-center gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-9 w-9 shadow-lg"
                              onClick={() => setEditingBlock({ ...block })}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Edit {block.blockName}</DialogTitle>
                            </DialogHeader>
                            {editingBlock && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label>Block Name</Label>
                                  <Input
                                    value={editingBlock.blockName}
                                    onChange={(e) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        blockName: e.target.value,
                                      })
                                    }
                                    placeholder="e.g. Block A"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Crop/Structure Name</Label>
                                  <Input
                                    value={editingBlock.cropName}
                                    onChange={(e) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        cropName: e.target.value,
                                      })
                                    }
                                    placeholder="e.g. Maize"
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Structure Type</Label>
                                  <Select
                                    value={editingBlock.structure}
                                    onValueChange={(value: any) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        structure: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="field">🌾 Field</SelectItem>
                                      <SelectItem value="barn">🏚️ Barn</SelectItem>
                                      <SelectItem value="house">🏠 House</SelectItem>
                                      <SelectItem value="greenhouse">🏡 Greenhouse</SelectItem>
                                      <SelectItem value="irrigation">💧 Irrigation</SelectItem>
                                      <SelectItem value="storage">📦 Storage</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Color Theme</Label>
                                  <Select
                                    value={editingBlock.color}
                                    onValueChange={(value) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        color: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {colorOptions.map((color) => (
                                        <SelectItem
                                          key={color.value}
                                          value={color.value}
                                        >
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={`h-4 w-4 rounded-full ${color.bgClass} ${color.borderClass} border-2`}
                                            />
                                            {color.label}
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Grid Position (Row, Column)</Label>
                                  <div className="flex gap-2">
                                    <div className="flex-1">
                                      <Input
                                        type="number"
                                        min="1"
                                        max="4"
                                        value={editingBlock.gridPosition.row}
                                        onChange={(e) =>
                                          setEditingBlock({
                                            ...editingBlock,
                                            gridPosition: {
                                              ...editingBlock.gridPosition,
                                              row: Number.parseInt(e.target.value) || 1,
                                            },
                                          })
                                        }
                                        placeholder="Row (1-4)"
                                      />
                                    </div>
                                    <div className="flex-1">
                                      <Input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={editingBlock.gridPosition.col}
                                        onChange={(e) =>
                                          setEditingBlock({
                                            ...editingBlock,
                                            gridPosition: {
                                              ...editingBlock.gridPosition,
                                              col: Number.parseInt(e.target.value) || 1,
                                            },
                                          })
                                        }
                                        placeholder="Col (1-5)"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Grid Size (Rows × Columns)</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      type="number"
                                      min="1"
                                      max="4"
                                      value={editingBlock.gridPosition.rowSpan}
                                      onChange={(e) =>
                                        setEditingBlock({
                                          ...editingBlock,
                                          gridPosition: {
                                            ...editingBlock.gridPosition,
                                            rowSpan: Number.parseInt(e.target.value) || 1,
                                          },
                                        })
                                      }
                                      placeholder="Rows"
                                    />
                                    <span className="flex items-center">×</span>
                                    <Input
                                      type="number"
                                      min="1"
                                      max="5"
                                      value={editingBlock.gridPosition.colSpan}
                                      onChange={(e) =>
                                        setEditingBlock({
                                          ...editingBlock,
                                          gridPosition: {
                                            ...editingBlock.gridPosition,
                                            colSpan: Number.parseInt(e.target.value) || 1,
                                          },
                                        })
                                      }
                                      placeholder="Cols"
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <Label>Growth Progress (%)</Label>
                                  <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={editingBlock.progress}
                                    onChange={(e) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        progress:
                                          Number.parseInt(e.target.value) || 0,
                                      })
                                    }
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={editingBlock.description || ''}
                                    onChange={(e) =>
                                      setEditingBlock({
                                        ...editingBlock,
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Add notes about this structure, crops, or conditions..."
                                    className="min-h-[80px] resize-none"
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter className="flex gap-2">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <DialogClose asChild>
                                <Button onClick={handleUpdateBlock} className="bg-green-600 hover:bg-green-700">
                                  Save Changes
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-9 w-9 shadow-lg"
                          onClick={() => handleDeleteBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Block content */}
                    <div className="relative z-5 flex flex-col items-center justify-center gap-1 text-center">
                      <span className="text-2xl sm:text-3xl drop-shadow-lg">{icon}</span>
                      <span className={`text-xs sm:text-sm font-bold ${colors.textClass} drop-shadow-sm`}>
                        {block.cropName}
                      </span>
                      <span className={`text-[10px] sm:text-xs ${colors.textClass} opacity-80`}>
                        {block.blockName}
                      </span>
                      {block.structure === 'field' && (
                        <div className="mt-1 w-full bg-white/30 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-white h-full rounded-full transition-all duration-500"
                            style={{ width: `${block.progress}%` }}
                          />
                        </div>
                      )}
                      {block.description && (
                        <p className={`text-[9px] sm:text-[10px] ${colors.textClass} opacity-70 mt-1 px-2 line-clamp-2`}>
                          {block.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Add new block button in edit mode */}
              {isEditingLayout && (
                <Dialog
                  open={addBlockDialogOpen}
                  onOpenChange={setAddBlockDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="border-2 border-dashed border-white/40 rounded-lg p-3 flex flex-col items-center justify-center hover:border-white/70 hover:bg-white/10 transition-all backdrop-blur-sm col-span-1 row-span-1">
                      <Plus className="h-8 w-8 text-white/70" />
                      <span className="text-xs font-medium text-white/70 mt-1">
                        Add Block
                      </span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Block</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label>Block Name</Label>
                        <Input
                          value={newBlockName}
                          onChange={(e) => setNewBlockName(e.target.value)}
                          placeholder="e.g. Block C"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Crop/Structure Name</Label>
                        <Input
                          value={newCropName}
                          onChange={(e) => setNewCropName(e.target.value)}
                          placeholder="e.g. Tomatoes"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label>Color Theme</Label>
                        <Select
                          value={newBlockColor}
                          onValueChange={setNewBlockColor}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colorOptions.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`h-4 w-4 rounded-full ${color.bgClass} ${color.borderClass} border-2`}
                                  />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddBlock} className="bg-green-600 hover:bg-green-700">Add Block</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>

          <Button
            size="sm"
            variant={isEditingLayout ? "default" : "secondary"}
            className={`absolute bottom-4 right-4 z-30 text-xs h-10 gap-2 shadow-lg transition-all ${
              isEditingLayout
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-white/95 backdrop-blur-sm border-2 border-green-300 hover:bg-green-50'
            }`}
            onClick={() => setIsEditingLayout(!isEditingLayout)}
          >
            {isEditingLayout ? (
              <>
                <Check className="h-4 w-4" /> Done Editing
              </>
            ) : (
              <>
                <Map className="h-4 w-4" /> Edit Layout
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#DCFCE7] p-1 h-auto rounded-2xl">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_20px_rgba(34,197,94,0.15)] data-[state=active]:text-[#15803D] py-2 text-xs sm:text-sm rounded-xl transition"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="soil"
              className="data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_20px_rgba(34,197,94,0.15)] data-[state=active]:text-[#15803D] py-2 text-xs sm:text-sm rounded-xl transition"
            >
              Soil Health
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="data-[state=active]:bg-white data-[state=active]:shadow-[0_8px_20px_rgba(34,197,94,0.15)] data-[state=active]:text-[#15803D] py-2 text-xs sm:text-sm rounded-xl transition"
            >
              Calendar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-white border-none shadow-[0_12px_30px_rgba(34,197,94,0.08)]">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">
                    Expected Yield
                  </p>
                  <p className="text-2xl font-serif font-bold text-[#15803D]">
                    2.4 Tons
                  </p>
                  <div className="flex items-center text-xs text-[#065F46] font-medium">
                    <span className="bg-[#22C55E]/10 px-1.5 py-0.5 rounded-full">
                      +12% vs last year
                    </span>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-white border-none shadow-[0_12px_30px_rgba(34,197,94,0.08)]">
                <CardContent className="p-4 space-y-2">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wider">
                    Total Blocks
                  </p>
                  <p className="text-2xl font-serif font-bold text-[#15803D]">
                    {farmBlocks.length}
                  </p>
                  <p className="text-xs text-[#94A3B8]">Active crops</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-none shadow-[0_12px_30px_rgba(34,197,94,0.08)] bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Growth Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {farmBlocks.map((block) => {
                    const colors = getColorClasses(block.color);
                    return (
                      <div key={block.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {block.cropName} ({block.blockName})
                          </span>
                          <span className="text-muted-foreground">
                            {block.progress}% to harvest
                          </span>
                        </div>
                        <div className="h-3 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full relative overflow-hidden transition-all duration-500 ${
                              block.color === "primary"
                                ? "bg-primary"
                                : block.color === "yellow"
                                ? "bg-[#E5B045]"
                                : block.color === "blue"
                                ? "bg-blue-500"
                                : block.color === "red"
                                ? "bg-red-500"
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${block.progress}%` }}
                          >
                            <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {farmBlocks.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">
                      No blocks added yet. Use "Edit Layout" to add blocks.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="soil" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Soil Composition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">6.5</div>
                    <div className="text-xs text-muted-foreground">
                      pH Level
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-primary">High</div>
                    <div className="text-xs text-muted-foreground">
                      Nitrogen
                    </div>
                  </div>
                  <div className="p-3 bg-secondary/50 rounded-lg">
                    <div className="text-lg font-bold text-[#C94A4A]">Low</div>
                    <div className="text-xs text-muted-foreground">
                      Phosphorus
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#FFF4E5] border border-[#E5B045]/30 rounded-lg flex gap-3">
                  <div className="shrink-0 mt-1">
                    <div className="h-2 w-2 rounded-full bg-[#E5B045]" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[#7A5815]">
                      Phosphorus Deficiency Detected
                    </p>
                    <p className="text-xs text-[#7A5815]/80">
                      Consider adding bone meal or rock phosphate fertilizer
                      during the next application.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    Upcoming Tasks
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Task</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label>Task Title</Label>
                          <Input placeholder="e.g. Inspect for pests" />
                        </div>
                        <div className="grid gap-2">
                          <Label>Date</Label>
                          <Input type="date" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            toast.success("Task added");
                          }}
                        >
                          Save Task
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 divide-y divide-border">
                {tasks.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    No upcoming tasks
                  </div>
                )}
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex gap-4 py-3 items-center animate-in fade-in slide-in-from-bottom-2"
                  >
                    <div
                      className={`flex flex-col items-center justify-center h-12 w-12 rounded-lg shrink-0 ${
                        task.color === "secondary"
                          ? "bg-secondary"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <span className="text-xs font-bold uppercase opacity-70">
                        {task.month}
                      </span>
                      <span className="text-lg font-bold">{task.date}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.subtitle}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 bg-transparent"
                      onClick={() => completeTask(task.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  );
}
