import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMachineDto } from './dto/create-machine.dto';

/**
 * Service handling all machine-related business logic
 * Provides CRUD operations and machine validation utilities
 *
 * @class MachinesService
 * @description Manages machine lifecycle and provides validation for dependent modules
 */
@Injectable()
export class MachinesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Creates a new machine in the database
   *
   * @param {CreateMachineDto} createMachineDto - Machine data to create
   * @returns {Promise<Machine>} Newly created machine with generated UUID
   * @throws {BadRequestException} If productId already exists (Prisma unique constraint)
   *
   * @example
   * const machine = await machinesService.create({
   *   productId: 'M23839',
   *   type: 'M'
   * });
   */
  async create(createMachineDto: CreateMachineDto) {
    return this.prisma.machine.create({
      data: createMachineDto,
    });
  }

  /**
   * Retrieves all machines with optional sensor reading statistics
   *
   * @param {boolean} includeStats - Include count of sensor readings per machine
   * @returns {Promise<Machine[]>} Array of all machines
   *
   * @example
   * // Get machines with sensor count
   * const machines = await machinesService.findAll(true);
   * // machines[0]._count.sensorReadings => 150
   */
  async findAll(includeStats = false) {
    return this.prisma.machine.findMany({
      include: includeStats
        ? {
            _count: {
              select: { sensorReadings: true },
            },
          }
        : undefined,
      orderBy: {
        productId: 'asc',
      },
    });
  }

  /**
   * Retrieves a single machine by ID
   *
   * @param {string} id - UUID of the machine
   * @returns {Promise<Machine>} Machine entity
   * @throws {NotFoundException} If machine with given ID doesn't exist
   *
   * @example
   * const machine = await machinesService.findOne('0315a637-b0f9-4498-9303-4844504a12f1');
   */
  async findOne(id: string) {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return machine;
  }

  /**
   * Retrieves a machine with detailed sensor reading statistics
   *
   * @param {string} id - UUID of the machine
   * @returns {Promise<MachineWithStats>} Machine with sensor count and latest readings
   * @throws {NotFoundException} If machine with given ID doesn't exist
   *
   * @example
   * const stats = await machinesService.findOneWithStats('0315a637-b0f9-4498-9303-4844504a12f1');
   * console.log(stats._count.sensorReadings); // Total sensor readings
   * console.log(stats.latestReadings); // Last 10 readings
   */
  async findOneWithStats(id: string) {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      include: {
        _count: {
          select: { sensorReadings: true },
        },
        sensorReadings: {
          take: 10,
          orderBy: {
            timestamp: 'desc',
          },
        },
      },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return machine;
  }

  /**
   * Validates if a machine exists in the database
   * Utility method for other modules to verify machineId references
   *
   * @param {string} id - UUID of the machine to validate
   * @returns {Promise<boolean>} True if machine exists
   * @throws {NotFoundException} If machine doesn't exist
   *
   * @example
   * // In SensorsService before creating sensor reading
   * await this.machinesService.validateMachineExists(machineId);
   */
  async validateMachineExists(id: string): Promise<boolean> {
    const machine = await this.prisma.machine.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!machine) {
      throw new NotFoundException(`Machine with ID ${id} not found`);
    }

    return true;
  }

  /**
   * Deletes a machine from the database
   * Note: Will fail if machine has related sensor readings due to FK constraint
   *
   * @param {string} id - UUID of the machine to delete
   * @returns {Promise<Machine>} Deleted machine entity
   * @throws {NotFoundException} If machine with given ID doesn't exist
   * @throws {BadRequestException} If machine has related sensor readings
   *
   * @example
   * const deleted = await machinesService.remove('0315a637-b0f9-4498-9303-4844504a12f1');
   */
  async remove(id: string) {
    // Verify machine exists first
    await this.findOne(id);

    return this.prisma.machine.delete({
      where: { id },
    });
  }
}
