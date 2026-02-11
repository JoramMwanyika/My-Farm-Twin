"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFarm, createBlocks } from "@/app/actions/farm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Warehouse, MapPin, Ruler, ArrowRight, Loader2, Plus, Trash2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export default function SetupPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [farmId, setFarmId] = useState<string | null>(null);

    // Step 2 State: Blocks
    const [blocks, setBlocks] = useState<{ name: string; type: string }[]>([
        { name: "Main Field", type: "Crop" }
    ]);
    const [newBlockName, setNewBlockName] = useState("");

    const addBlock = () => {
        if (!newBlockName.trim()) return;
        setBlocks([...blocks, { name: newBlockName, type: "Crop" }]);
        setNewBlockName("");
    };

    const removeBlock = (index: number) => {
        setBlocks(blocks.filter((_, i) => i !== index));
    };

    async function handleStep1Submit(formData: FormData) {
        setIsLoading(true);
        try {
            const result = await createFarm(formData);
            if (result.error) {
                toast.error("Error", { description: result.error });
            } else if (result.farmId) {
                setFarmId(result.farmId);
                setStep(2);
                toast.success("Farm details saved!");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    async function handleStep2Submit() {
        if (!farmId) return;
        setIsLoading(true);

        try {
            const result = await createBlocks(farmId, blocks);

            if (result.error) {
                toast.error("Error", { description: result.error });
            } else {
                toast.success("Setup Complete!", {
                    description: "Redirecting to your dashboard...",
                });
                router.push("/dashboard");
            }
        } catch (error) {
            toast.error("Failed to save layout");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0a1f16] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#c0ff01]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#4ade80]/5 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center p-4 bg-[#c0ff01]/10 rounded-full mb-4">
                        <Leaf className="h-10 w-10 text-[#c0ff01]" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">
                        {step === 1 ? "Setup Your Farm" : "Design Your Layout"}
                    </h1>
                    <p className="text-gray-400">
                        {step === 1 ? "Tell us about your land" : "Define your growing zones"}
                    </p>
                </div>

                <Card className="border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl text-white flex items-center gap-2">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c0ff01] text-black text-xs font-bold">1</div>
                                        Farm Details
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <form action={handleStep1Submit} className="space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-gray-300">Farm Name</Label>
                                            <div className="relative">
                                                <Input id="name" name="name" placeholder="e.g. Green Valley Farm" required className="bg-black/20 border-white/10 text-white pl-10 h-11 focus:border-[#c0ff01]" />
                                                <Leaf className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="location" className="text-gray-300">Location</Label>
                                            <div className="relative">
                                                <Input id="location" name="location" placeholder="e.g. Nairobi, Kenya" required className="bg-black/20 border-white/10 text-white pl-10 h-11 focus:border-[#c0ff01]" />
                                                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="size" className="text-gray-300">Size (Acres)</Label>
                                            <div className="relative">
                                                <Input id="size" name="size" type="number" step="0.1" placeholder="e.g. 50.5" required className="bg-black/20 border-white/10 text-white pl-10 h-11 focus:border-[#c0ff01]" />
                                                <Ruler className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                                            </div>
                                        </div>
                                        <Button type="submit" className="w-full bg-[#c0ff01] hover:bg-[#b0ef00] text-[#0a1f16] font-bold h-12 mt-4" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <>Next Step <ArrowRight className="ml-2 h-4 w-4" /></>}
                                        </Button>
                                    </form>
                                </CardContent>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-xl text-white flex items-center gap-2">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#c0ff01] text-black text-xs font-bold">2</div>
                                        Define Blocks
                                    </CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Divide your farm into manageable zones (e.g. "Maize Field", "Greenhouse 1")
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-3">
                                        {blocks.map((block, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 animate-in fade-in slide-in-from-bottom-2">
                                                <span className="text-white font-medium">{block.name}</span>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => removeBlock(index)} className="text-red-400 hover:text-red-300 hover:bg-red-900/20 h-8 w-8 p-0">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            value={newBlockName}
                                            onChange={(e) => setNewBlockName(e.target.value)}
                                            placeholder="Block Name (e.g., 'Beans Field')"
                                            className="bg-black/20 border-white/10 text-white focus:border-[#c0ff01]"
                                            onKeyDown={(e) => e.key === 'Enter' && addBlock()}
                                        />
                                        <Button type="button" onClick={addBlock} className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 flex gap-3">
                                        <Button variant="outline" onClick={() => setStep(1)} className="flex-1 bg-transparent border-white/10 text-white hover:bg-white/5" disabled={isLoading}>
                                            Back
                                        </Button>
                                        <Button onClick={handleStep2Submit} className="flex-[2] bg-[#c0ff01] hover:bg-[#b0ef00] text-[#0a1f16] font-bold" disabled={isLoading || blocks.length === 0}>
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Finishing...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                    Finish Setup
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card>
            </motion.div>
        </div>
    );
}
