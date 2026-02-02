
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const blocks = [
        {
            blockId: 1,
            blockName: 'Block A - Maize (DB)',
            healthStatus: 'healthy',
            progress: 60,
            moisture: 45,
            temp: 22,
        },
        {
            blockId: 2,
            blockName: 'Block B - Beans (DB)',
            healthStatus: 'warning',
            progress: 85,
            moisture: 30,
            temp: 24,
        },
        {
            blockId: 3,
            blockName: 'Greenhouse (DB)',
            healthStatus: 'healthy',
            progress: 50,
            moisture: 65,
            temp: 26,
        },
    ]

    for (const block of blocks) {
        await prisma.sensorReading.create({
            data: block,
        })
    }

    console.log('Seeding finished.')
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
