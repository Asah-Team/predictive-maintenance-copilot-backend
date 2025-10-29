import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MachinesService } from '../machines/machines.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';

@Injectable()
export class SensorsService {
  constructor(
    private prisma: PrismaService,
    private machinesService: MachinesService,
  ) {}

  async create(createSensorReadingDto: CreateSensorReadingDto) {
    // Find machine by productId
    const machine = await this.prisma.machine.findUnique({
      where: { productId: createSensorReadingDto.productId },
    });

    if (!machine) {
      throw new Error(
        `Machine with Product ID ${createSensorReadingDto.productId} not found`,
      );
    }

    const data: any = {
      machineId: machine.id,
      airTemp: createSensorReadingDto.airTemp,
      processTemp: createSensorReadingDto.processTemp,
      rotationalSpeed: createSensorReadingDto.rotationalSpeed,
      torque: createSensorReadingDto.torque,
      toolWear: createSensorReadingDto.toolWear,
    };

    if (createSensorReadingDto.timestamp) {
      data.timestamp = new Date(createSensorReadingDto.timestamp);
    }

    return this.prisma.sensorData.create({
      data,
      include: {
        machine: true,
      },
    });
  }

  async findAll(machineId?: string, limit = 100) {
    // Validate machine exists if machineId filter is provided
    if (machineId) {
      await this.machinesService.validateMachineExists(machineId);
    }

    return this.prisma.sensorData.findMany({
      where: machineId ? { machineId } : {},
      include: {
        machine: true,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });
  }

  async findLatest(machineId: string) {
    // Validate machine exists before querying latest reading
    await this.machinesService.validateMachineExists(machineId);

    return this.prisma.sensorData.findFirst({
      where: { machineId },
      orderBy: {
        timestamp: 'desc',
      },
      include: {
        machine: true,
      },
    });
  }

  async getStatistics(machineId: string, hours = 24) {
    // Validate machine exists before calculating statistics
    await this.machinesService.validateMachineExists(machineId);

    const since = new Date();
    since.setHours(since.getHours() - hours);

    const readings = await this.prisma.sensorData.findMany({
      where: {
        machineId,
        timestamp: {
          gte: since,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (readings.length === 0) {
      return null;
    }

    const stats = {
      count: readings.length,
      airTemp: this.calculateStats(readings.map((r) => r.airTemp)),
      processTemp: this.calculateStats(readings.map((r) => r.processTemp)),
      rotationalSpeed: this.calculateStats(
        readings.map((r) => r.rotationalSpeed),
      ),
      torque: this.calculateStats(readings.map((r) => r.torque)),
      toolWear: this.calculateStats(readings.map((r) => r.toolWear)),
    };

    return stats;
  }

  private calculateStats(values: number[]) {
    const sorted = [...values].sort((a, b) => a - b);
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = sum / values.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];

    return {
      min,
      max,
      avg: Number(avg.toFixed(2)),
    };
  }
}
