import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

/**
 * Simulate real-time sensor data generation
 * This script will continuously insert sensor readings to test realtime functionality
 */
async function simulateRealtimeData() {
  console.log('🤖 Starting sensor data simulator...\n');

  // Get all machines
  const machines = await prisma.machine.findMany();

  if (machines.length === 0) {
    console.error('❌ No machines found. Please run seed first: npm run prisma:seed');
    process.exit(1);
  }

  console.log(`📡 Found ${machines.length} machines:`);
  machines.forEach((m) => console.log(`   - ${m.name} (${m.type})`));
  console.log('\n⏱️  Generating sensor readings every 5 seconds...\n');

  let readingCount = 0;

  // Generate readings every 5 seconds
  setInterval(async () => {
    try {
      for (const machine of machines) {
        // Generate realistic sensor data based on machine type
        const baseTemp = machine.type === 'High' ? 305 : machine.type === 'Medium' ? 300 : 298;
        const baseSpeed = machine.type === 'High' ? 2000 : machine.type === 'Medium' ? 1500 : 1000;

        // Add some randomness and occasional anomalies
        const isAnomaly = Math.random() < 0.1; // 10% chance of anomaly

        const reading = {
          machineId: machine.id,
          airTemp: isAnomaly
            ? baseTemp + (Math.random() > 0.5 ? 15 : -15) // Anomaly: extreme temp
            : baseTemp + Math.random() * 5 - 2.5, // Normal variation
          processTemp: isAnomaly
            ? baseTemp + 25 // Anomaly: high process temp
            : baseTemp + 10 + Math.random() * 5 - 2.5,
          rotationalSpeed: isAnomaly
            ? Math.floor(baseSpeed + 1500) // Anomaly: high speed
            : Math.floor(baseSpeed + Math.random() * 200 - 100),
          torque: isAnomaly
            ? 75 + Math.random() * 10 // Anomaly: high torque
            : 40 + Math.random() * 20 - 10,
          toolWear: Math.floor(100 + readingCount * 2 + Math.random() * 20),
        };

        await prisma.sensorData.create({
          data: reading,
        });

        const status = isAnomaly ? '⚠️  ANOMALY' : '✅ Normal';
        console.log(
          `${status} | ${machine.name} | Temp: ${reading.airTemp.toFixed(1)}K | ` +
            `Speed: ${reading.rotationalSpeed} RPM | Torque: ${reading.torque.toFixed(1)} Nm`,
        );
      }

      readingCount++;
    } catch (error) {
      console.error('❌ Error generating reading:', error.message);
    }
  }, 5000); // Every 5 seconds

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n\n🛑 Stopping simulator...');
    await prisma.$disconnect();
    process.exit(0);
  });
}

simulateRealtimeData();
