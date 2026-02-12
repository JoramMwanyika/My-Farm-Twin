import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { inferStructure, inferColor, inferCropType } from "@/lib/farm-utils";

export async function GET() {
    const session = await auth();

    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.user.findUnique({
            where: { email: session.user.email },
            include: {
                farms: {
                    include: {
                        blocks: {
                            include: {
                                readings: {
                                    orderBy: { createdAt: 'desc' },
                                    take: 1
                                }
                            }
                        },
                        alerts: {
                            where: { isRead: false },
                            take: 5
                        }
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const farm = user.farms[0]; // Assuming single farm for now

        // Just return empty structure if no farm (though layout should catch this)
        if (!farm) {
            return NextResponse.json({
                user: { name: user.name?.split(' ')[0] || 'Farmer' },
                farm: null,
                stats: null,
                blocks: []
            });
        }

        const blocksData = await Promise.all(farm.blocks.map(async (block, index) => {
            // Self-healing: logical check if this block needs layout initialization
            // If it's at 1,1 and colliding with others (or just generally uninitialized if index > 0)
            // A simple heuristic: if index > 0 but row/col are 1,1, it's likely uninitialized.
            // Or if all blocks are at 1,1. Let's just fix it if it looks default.

            // Correction: Check if we need to fix layout for ALL blocks first?
            let gridRow = block.gridRow || 1;
            let gridCol = block.gridCol || 1;
            let gridRowSpan = block.gridRowSpan || 1;
            let gridColSpan = block.gridColSpan || 1;

            // If we detect a collision at 1,1 for multiple blocks, we distribute them.
            // But doing this per-block in map is tricky. 
            // Better strategy: If we find blocks that are seemingly default (created before layout),
            // we should probably fix them.

            // Let's do a quick check: if block index > 0 and position is 1,1, it's overlapping the first one.
            // We can just calculate the intended position based on index and return that (and update DB optionally/async).
            // Self-healing: logical check if this block needs layout initialization
            let structure = block.structure || inferStructure(block.name);
            // If it was already set but is just 'field', maybe we can refine it if we have better logic now? 
            // Only if it looks like a default. For now, let's respect DB if it's not null/empty.
            // But if it is 'field' and name implies 'House', we should probably fix it? 
            // Let's stick to filling missing/default values.

            // Actually, if we are doing self-healing for positions, let's also heal structure if it mismatchs name strongly?
            // No, user might have renamed. Let's just trust DB unless it's clearly default.

            let color = block.color || inferColor(structure, block.cropType || undefined);

            if ((gridRow === 1 && gridCol === 1 && index > 0) || !block.structure) {
                // It's likely uninitialized. Let's calculate a default position.
                const col = (index % 3) + 1;
                const row = Math.floor(index / 3) + 1;
                gridCol = col;
                gridRow = row;

                // Async fix (fire and forget)
                try {
                    await db.block.update({
                        where: { id: block.id },
                        data: {
                            gridCol: col,
                            gridRow: row,
                            structure: structure, // Save inferred
                            color: color // Save inferred
                        }
                    });
                } catch (e) {
                    console.error("Failed to auto-heal block layout", e);
                }
            }

            const latestReading = block.readings[0];
            return {
                id: block.id,
                name: block.name,
                healthStatus: latestReading?.healthStatus || 'unknown',
                progress: latestReading?.progress || 0,
                moisture: latestReading?.moisture || '--',
                temp: latestReading?.temp || '--',
                // Layout fields
                structure: structure,
                cropType: block.cropType,
                color: color,
                gridPosition: {
                    row: gridRow,
                    col: gridCol,
                    rowSpan: gridRowSpan,
                    colSpan: gridColSpan
                }
            };
        }));

        const activeBlocks = farm.blocks.length;
        // Calculate health based on blocks (simple logic)
        const healthyBlocks = blocksData.filter(b => b.healthStatus === 'healthy').length;
        const healthPercentage = activeBlocks > 0 ? Math.round((healthyBlocks / activeBlocks) * 100) : 0;

        return NextResponse.json({
            user: {
                name: user.name?.split(' ')[0] || 'Farmer' // First name only
            },
            farm: {
                id: farm.id,
                name: farm.name,
                location: farm.location
            },
            stats: {
                activeBlocks,
                pendingTasks: 3, // Placeholder
                alerts: farm.alerts.length,
                health: `${healthPercentage}%`
            },
            blocks: blocksData,
            alerts: farm.alerts
        });

    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
