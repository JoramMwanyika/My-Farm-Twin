const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const userCount = await prisma.user.count();
        const farmCount = await prisma.farm.count();
        const blockCount = await prisma.block.count();
        const readingCount = await prisma.sensorReading.count();

        console.log(`\nVerification Summary:`);
        console.log(`Users: ${userCount}`);
        console.log(`Farms: ${farmCount}`);
        console.log(`Blocks: ${blockCount}`);
        console.log(`SensorReadings: ${readingCount}`);

        if (userCount > 0) {
            const user = await prisma.user.findFirst({
                include: { farms: true }
            });
            console.log('\nSample User:', user.email);
            console.log('Farms:', user.farms.map(f => f.name).join(', '));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
