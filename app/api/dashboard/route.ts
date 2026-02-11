import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

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

        const blocksData = farm.blocks.map(block => {
            const latestReading = block.readings[0];
            return {
                id: block.id,
                name: block.name,
                healthStatus: latestReading?.healthStatus || 'unknown',
                progress: latestReading?.progress || 0,
                moisture: latestReading?.moisture || '--',
                temp: latestReading?.temp || '--'
            };
        });

        const activeBlocks = farm.blocks.length;
        // Calculate health based on blocks (simple logic)
        const healthyBlocks = blocksData.filter(b => b.healthStatus === 'healthy').length;
        const healthPercentage = activeBlocks > 0 ? Math.round((healthyBlocks / activeBlocks) * 100) : 0;

        return NextResponse.json({
            user: {
                name: user.name?.split(' ')[0] || 'Farmer' // First name only
            },
            farm: {
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
