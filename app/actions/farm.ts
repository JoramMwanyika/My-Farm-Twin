"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";
import { inferStructure, inferCropType, inferColor } from "@/lib/farm-utils";

const createFarmSchema = z.object({
    name: z.string().min(2, "Farm name is required"),
    location: z.string().min(2, "Location is required"),
    size: z.number().min(0.1, "Size must be greater than 0"),
});

export async function createFarm(formData: FormData) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    const user = await db.user.findUnique({
        where: { email: session.user.email },
    });

    if (!user) {
        return { error: "User not found" };
    }

    const rawData = {
        name: formData.get("name"),
        location: formData.get("location"),
        size: Number(formData.get("size")),
    };

    const result = createFarmSchema.safeParse(rawData);

    if (!result.success) {
        return { error: "Invalid input", details: result.error.flatten() };
    }

    try {
        const farm = await db.farm.create({
            data: {
                ...result.data,
                userId: user.id,
            },
        });

        return { success: true, farmId: farm.id };
    } catch (error) {
        console.error("Failed to create farm:", error);
        return { error: "Failed to create farm" };
    }
}

export async function createBlocks(farmId: string, blocks: { name: string; type: string }[]) {
    const session = await auth();

    if (!session?.user?.email) {
        return { error: "Not authenticated" };
    }

    // 1. Verify Farm Ownership (Isolation Check)
    const farm = await db.farm.findUnique({
        where: { id: farmId },
        include: { user: true },
    });

    if (!farm) {
        return { error: "Farm not found" };
    }

    if (farm.user.email !== session.user.email) {
        return { error: "Unauthorized access to this farm" };
    }

    // 2. Batch Create Blocks
    try {
        await db.$transaction(
            blocks.map((block, index) => {
                // simple grid layout logic (e.g., 3 columns)
                const col = (index % 3) + 1;
                const row = Math.floor(index / 3) + 1;

                return db.block.create({
                    data: {
                        name: block.name,
                        farmId: farm.id,
                        healthStatus: "unknown", // Default
                        progress: 0,
                        structure: inferStructure(block.name),
                        cropType: inferCropType(block.name, inferStructure(block.name)),
                        gridCol: col,
                        gridRow: row,
                        color: inferColor(inferStructure(block.name), inferCropType(block.name, inferStructure(block.name)))
                    },
                });
            })
        );

        return { success: true };
    } catch (error) {
        console.error("Failed to create blocks:", error);
        return { error: "Failed to create blocks" };
    }
}


// Helper moved to lib/farm-utils.ts
// function inferStructure...



export async function updateBlockLayout(blockId: string, updates: {
    gridRow?: number;
    gridCol?: number;
    gridRowSpan?: number;
    gridColSpan?: number;
    color?: string;
    structure?: string;
    cropType?: string;
    description?: string;
}) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    try {
        const block = await db.block.findUnique({
            where: { id: blockId },
            include: { farm: { include: { user: true } } }
        });

        if (!block) return { error: "Block not found" };
        if (block.farm.user.email !== session.user.email) return { error: "Unauthorized" };

        await db.block.update({
            where: { id: blockId },
            data: {
                gridRow: updates.gridRow,
                gridCol: updates.gridCol,
                gridRowSpan: updates.gridRowSpan,
                gridColSpan: updates.gridColSpan,
                color: updates.color,
                structure: updates.structure,
                cropType: updates.cropType,
            }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to update block layout:", error);
        return { error: "Failed to update block" };
    }
}

export async function createBlock(farmId: string, data: {
    name: string;
    cropType?: string;
    structure: string;
    color: string;
    gridRow: number;
    gridCol: number;
    gridRowSpan: number;
    gridColSpan: number;
}) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    try {
        const farm = await db.farm.findUnique({
            where: { id: farmId },
            include: { user: true }
        });

        if (!farm) return { error: "Farm not found" };
        if (farm.user.email !== session.user.email) return { error: "Unauthorized" };

        const block = await db.block.create({
            data: {
                farmId: farm.id,
                name: data.name,
                cropType: data.cropType,
                structure: data.structure,
                color: data.color,
                gridRow: data.gridRow,
                gridCol: data.gridCol,
                gridRowSpan: data.gridRowSpan,
                gridColSpan: data.gridColSpan,
                healthStatus: "unknown",
                progress: 0
            }
        });

        return { success: true, block };
    } catch (error) {
        console.error("Failed to create block:", error);
        return { error: "Failed to create block" };
    }
}

export async function deleteBlock(blockId: string) {
    const session = await auth();
    if (!session?.user?.email) return { error: "Not authenticated" };

    try {
        const block = await db.block.findUnique({
            where: { id: blockId },
            include: { farm: { include: { user: true } } }
        });

        if (!block) return { error: "Block not found" };
        if (block.farm.user.email !== session.user.email) return { error: "Unauthorized" };

        await db.block.delete({
            where: { id: blockId }
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to delete block:", error);
        return { error: "Failed to delete block" };
    }
}
