import { PrismaClient } from '../generated/prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning up existing data...');
  await prisma.sensorData.deleteMany({});
  await prisma.machine.deleteMany({});

  // Create machines
  console.log('🏭 Creating machines...');
  const machines = await Promise.all([
    prisma.machine.create({
      data: {
        name: 'CNC-001',
        type: 'High',
      },
    }),
    prisma.machine.create({
      data: {
        name: 'CNC-002',
        type: 'Medium',
      },
    }),
    prisma.machine.create({
      data: {
        name: 'CNC-003',
        type: 'Low',
      },
    }),
  ]);

  console.log(`✅ Created ${machines.length} machines`);

  // Create sensor readings for each machine
  console.log('📊 Creating sensor readings...');
  
  const sensorReadings: any[] = [];
  
  for (const machine of machines) {
    // Create 100 historical readings per machine
    for (let i = 0; i < 100; i++) {
      const timestamp = new Date();
      timestamp.setMinutes(timestamp.getMinutes() - (100 - i) * 5); // 5 minutes apart

      // Generate realistic sensor data based on machine type
      const baseTemp = machine.type === 'High' ? 305 : machine.type === 'Medium' ? 300 : 298;
      const baseSpeed = machine.type === 'High' ? 2000 : machine.type === 'Medium' ? 1500 : 1000;
      
      sensorReadings.push({
        machineId: machine.id,
        timestamp,
        airTemp: baseTemp + Math.random() * 5 - 2.5,
        processTemp: baseTemp + 10 + Math.random() * 5 - 2.5,
        rotationalSpeed: Math.floor(baseSpeed + Math.random() * 200 - 100),
        torque: 40 + Math.random() * 20 - 10,
        toolWear: Math.floor(50 + i * 1.5 + Math.random() * 10),
      });
    }
  }

  // Insert sensor readings in batches
  const batchSize = 50;
  for (let i = 0; i < sensorReadings.length; i += batchSize) {
    const batch = sensorReadings.slice(i, i + batchSize);
    await prisma.sensorData.createMany({
      data: batch,
    });
    console.log(`📈 Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(sensorReadings.length / batchSize)}`);
  }

  console.log(`✅ Created ${sensorReadings.length} sensor readings`);

  // Display summary
  console.log('\n📋 Seeding Summary:');
  machines.forEach((machine) => {
    console.log(`  - ${machine.name} (${machine.type}): ${machine.id}`);
  });

  console.log('\n✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
