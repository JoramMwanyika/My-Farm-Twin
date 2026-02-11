"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { z } from "zod";

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
            blocks.map((block) =>
                db.block.create({
                    data: {
                        name: block.name,
                        farmId: farm.id,
                        healthStatus: "unknown", // Default
                        progress: 0,
                    },
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error("Failed to create blocks:", error);
        return { error: "Failed to create blocks" };
    }
}
