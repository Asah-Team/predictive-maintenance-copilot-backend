import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MachinesService } from './machines.service';
import { CreateMachineDto } from './dto/create-machine.dto';

/**
 * Controller handling machine management endpoints
 * Provides RESTful API for machine CRUD operations
 *
 * @class MachinesController
 * @route /machines
 * @description Manages machine lifecycle and provides machine statistics
 */
@Controller('machines')
export class MachinesController {
  constructor(private readonly machinesService: MachinesService) {}

  /**
   * Creates a new machine
   *
   * @route POST /machines
   * @param {CreateMachineDto} createMachineDto - Machine data (name, type)
   * @returns {Promise<Machine>} Newly created machine with UUID
   * @throws {BadRequestException} If validation fails or machine name already exists
   *
   * @example
   * POST /machines
   * Body: {
   *   "name": "CNC-004",
   *   "type": "CNC"
   * }
   * Response: {
   *   "id": "uuid-here",
   *   "name": "CNC-004",
   *   "type": "CNC",
   *   "createdAt": "2024-01-15T10:30:00.000Z"
   * }
   */
  @Post()
  async create(@Body() createMachineDto: CreateMachineDto) {
    return this.machinesService.create(createMachineDto);
  }

  /**
   * Retrieves all machines with optional statistics
   *
   * @route GET /machines?includeStats=true
   * @param {string} includeStats - Query param to include sensor reading counts
   * @returns {Promise<Machine[]>} Array of all machines
   *
   * @example
   * GET /machines?includeStats=true
   * Response: [
   *   {
   *     "id": "uuid-1",
   *     "name": "CNC-001",
   *     "type": "CNC",
   *     "createdAt": "2024-01-15T10:30:00.000Z",
   *     "_count": { "sensorReadings": 150 }
   *   }
   * ]
   */
  @Get()
  async findAll(@Query('includeStats') includeStats?: string) {
    const stats = includeStats === 'true';
    return this.machinesService.findAll(stats);
  }

  /**
   * Retrieves a single machine by ID
   *
   * @route GET /machines/:id
   * @param {string} id - Machine UUID
   * @returns {Promise<Machine>} Machine entity
   * @throws {NotFoundException} If machine not found
   *
   * @example
   * GET /machines/0315a637-b0f9-4498-9303-4844504a12f1
   * Response: {
   *   "id": "0315a637-b0f9-4498-9303-4844504a12f1",
   *   "name": "CNC-001",
   *   "type": "CNC",
   *   "createdAt": "2024-01-15T10:30:00.000Z"
   * }
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.machinesService.findOne(id);
  }

  /**
   * Retrieves a machine with detailed sensor statistics
   *
   * @route GET /machines/:id/stats
   * @param {string} id - Machine UUID
   * @returns {Promise<MachineWithStats>} Machine with sensor count and latest readings
   * @throws {NotFoundException} If machine not found
   *
   * @example
   * GET /machines/0315a637-b0f9-4498-9303-4844504a12f1/stats
   * Response: {
   *   "id": "0315a637-b0f9-4498-9303-4844504a12f1",
   *   "name": "CNC-001",
   *   "type": "CNC",
   *   "_count": { "sensorReadings": 150 },
   *   "latestReadings": [{ timestamp, temperature, ... }]
   * }
   */
  @Get(':id/stats')
  async findOneWithStats(@Param('id') id: string) {
    return this.machinesService.findOneWithStats(id);
  }

  /**
   * Deletes a machine
   * Note: Will fail if machine has related sensor readings
   *
   * @route DELETE /machines/:id
   * @param {string} id - Machine UUID to delete
   * @returns {Promise<Machine>} Deleted machine entity
   * @throws {NotFoundException} If machine not found
   * @throws {BadRequestException} If machine has related sensor readings
   *
   * @example
   * DELETE /machines/0315a637-b0f9-4498-9303-4844504a12f1
   * Response: {
   *   "id": "0315a637-b0f9-4498-9303-4844504a12f1",
   *   "name": "CNC-001",
   *   "type": "CNC",
   *   "createdAt": "2024-01-15T10:30:00.000Z"
   * }
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.machinesService.remove(id);
  }
}
