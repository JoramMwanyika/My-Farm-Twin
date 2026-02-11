
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...');

    // 1. Create User
    // Password: password123
    const hashedPassword = await bcrypt.hash('password123', 10);

    const user = await prisma.user.upsert({
        where: { email: 'demo@agrivoice.com' },
        update: {},
        create: {
            email: 'demo@agrivoice.com',
            name: 'Demo Farmer',
            password: hashedPassword,
            role: 'user',
        },
    });

    console.log(`Created user: ${user.name}`);

    // 2. Create Farm
    const farm = await prisma.farm.create({
        data: {
            name: 'Green Valley Farm',
            location: 'Nairobi, Kenya',
            size: 50.5,
            userId: user.id,
        },
    });

    console.log(`Created farm: ${farm.name}`);

    // 3. Create Blocks
    const blocksData = [
        {
            name: 'Block A - Maize',
            cropType: 'Maize',
            area: 12.0,
            readings: {
                create: {
                    healthStatus: 'healthy',
                    progress: 60,
                    moisture: 45,
                    temp: 22,
                    humidity: 60,
                    nitrogen: 140,
                    phosphorus: 45,
                    potassium: 180,
                    ph: 6.5,
                }
            }
        },
        {
            name: 'Block B - Beans',
            cropType: 'Beans',
            area: 8.5,
            readings: {
                create: {
                    healthStatus: 'warning',
                    progress: 85,
                    moisture: 30,
                    temp: 24,
                    humidity: 55,
                    nitrogen: 110,
                    phosphorus: 30,
                    potassium: 150,
                    ph: 5.8,
                }
            }
        },
        {
            name: 'Greenhouse 1',
            cropType: 'Tomatoes',
            area: 0.5,
            readings: {
                create: {
                    healthStatus: 'healthy',
                    progress: 50,
                    moisture: 65,
                    temp: 26,
                    humidity: 80,
                    nitrogen: 200,
                    phosphorus: 60,
                    potassium: 250,
                    ph: 6.2,
                }
            }
        },
    ];

    for (const blockData of blocksData) {
        await prisma.block.create({
            data: {
                name: blockData.name,
                cropType: blockData.cropType,
                area: blockData.area,
                farmId: farm.id,
                readings: blockData.readings,
            },
        });
    }

    // 4. Create Alerts
    await prisma.alert.createMany({
        data: [
            {
                type: 'warning',
                message: 'Low moisture levels detected in Block B - Beans.',
                farmId: farm.id,
            },
            {
                type: 'info',
                message: 'Scheduled irrigation for Greenhouse 1 completed.',
                farmId: farm.id,
            },
        ],
    });

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
