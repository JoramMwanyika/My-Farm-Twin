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
};

const colorOptions = [
  {
    value: "primary",
    label: "Green",
    bgClass: "bg-primary/20",
    borderClass: "border-primary",
    textClass: "text-primary",
  },
  {
    value: "yellow",
    label: "Yellow",
    bgClass: "bg-[#E5B045]/20",
    borderClass: "border-[#E5B045]",
    textClass: "text-[#7A5815]",
  },
  {
    value: "blue",
    label: "Blue",
    bgClass: "bg-blue-500/20",
    borderClass: "border-blue-500",
    textClass: "text-blue-700",
  },
  {
    value: "red",
    label: "Red",
    bgClass: "bg-red-500/20",
    borderClass: "border-red-500",
    textClass: "text-red-700",
  },
  {
    value: "purple",
    label: "Purple",
    bgClass: "bg-purple-500/20",
    borderClass: "border-purple-500",
    textClass: "text-purple-700",
  },
];

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
    },
    {
      id: 2,
      cropName: "Beans",
      blockName: "Block B",
      color: "yellow",
      progress: 85,
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
    const newBlock: FarmBlock = {
      id: Date.now(),
      cropName: newCropName,
      blockName: newBlockName,
      color: newBlockColor,
      progress: 0,
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
    <div className="min-h-screen bg-[#F7FFF3] pb-24">
      <Header title="My Farm Twin" />

      <main className="container px-4 py-6 space-y-8">
        <section className="rounded-3xl bg-linear-to-br from-[#E6FFEA] via-white to-[#FFF9DB] border border-[#B4F0C3] p-6 shadow-sm space-y-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-wide uppercase text-[#16A34A]">
                Digital twin
              </p>
              <h2 className="text-3xl font-serif text-[#14532D]">
                Your fields are synced and healthy
              </h2>
              <p className="text-sm text-[#4B5563] max-w-2xl">
                Monitor crop layout, soil health, and daily tasks in one glance.
                Use edit mode to rearrange blocks or log new activities directly
                from the map.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#22C55E] hover:bg-[#16A34A] text-white">
                Export Snapshot
              </Button>
              <Button
                variant="secondary"
                className="border-[#FFD447] text-[#8A6A00] bg-white hover:bg-[#FFF4C2]"
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
        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-[#B4F0C3] shadow-[0_20px_60px_rgba(15,118,110,0.12)] bg-linear-to-br from-[#E6FFF0] via-white to-[#FFEFBF] flex items-center justify-center">
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#16A34A_0.5px,transparent_0.5px)] [background-size:20px_20px]"></div>
          <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#14532D] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" /> Healthy
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#854D0E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#FACC15]" /> Watch list
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#1D4ED8] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#60A5FA]" /> Irrigation
            </span>
          </div>

          <div
            className={`relative z-10 grid gap-4 w-3/4 ${
              farmBlocks.length <= 2
                ? "grid-cols-2"
                : farmBlocks.length <= 4
                ? "grid-cols-2"
                : "grid-cols-3"
            }`}
          >
            {farmBlocks.map((block) => {
              const colors = getColorClasses(block.color);
              return (
                <div
                  key={block.id}
                  className={`${colors.bgClass} border-2 ${colors.borderClass} rounded-lg p-2 flex flex-col items-center justify-center aspect-square relative group`}
                >
                  {isEditingLayout && (
                    <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center gap-2 z-10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8"
                            onClick={() => setEditingBlock({ ...block })}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
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
                                <Label>Crop Name</Label>
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
                                <Label>Color</Label>
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
                                            className={`h-3 w-3 rounded-full ${color.bgClass} ${color.borderClass} border`}
                                          />
                                          {color.label}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
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
                            </div>
                          )}
                          <DialogFooter className="flex gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <DialogClose asChild>
                              <Button onClick={handleUpdateBlock}>
                                Save Changes
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8"
                        onClick={() => handleDeleteBlock(block.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  <Sprout className={`h-6 w-6 ${colors.textClass} mb-1`} />
                  <span className={`text-xs font-bold ${colors.textClass}`}>
                    {block.cropName}
                  </span>
                  <span className={`text-[10px] ${colors.textClass}/80`}>
                    {block.blockName}
                  </span>
                </div>
              );
            })}

            {isEditingLayout && (
              <Dialog
                open={addBlockDialogOpen}
                onOpenChange={setAddBlockDialogOpen}
              >
                <DialogTrigger asChild>
                  <button className="border-2 border-dashed border-[#2D5A47]/50 rounded-lg p-2 flex flex-col items-center justify-center aspect-square hover:border-[#2D5A47] hover:bg-[#2D5A47]/10 transition-colors">
                    <Plus className="h-6 w-6 text-[#2D5A47]/70" />
                    <span className="text-xs font-medium text-[#2D5A47]/70 mt-1">
                      Add Block
                    </span>
                  </button>
                </DialogTrigger>
                <DialogContent>
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
                      <Label>Crop Name</Label>
                      <Input
                        value={newCropName}
                        onChange={(e) => setNewCropName(e.target.value)}
                        placeholder="e.g. Tomatoes"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Color</Label>
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
                                  className={`h-3 w-3 rounded-full ${color.bgClass} ${color.borderClass} border`}
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
                    <Button onClick={handleAddBlock}>Add Block</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <Button
            size="sm"
            variant={isEditingLayout ? "default" : "secondary"}
            className="absolute bottom-4 right-4 text-xs h-8 gap-1 shadow-sm"
            onClick={() => setIsEditingLayout(!isEditingLayout)}
          >
            {isEditingLayout ? (
              <>
                <Check className="h-3 w-3" /> Done Editing
              </>
            ) : (
              <>
                <Map className="h-3 w-3" /> Edit Layout
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
