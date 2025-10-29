import { Controller, Get, Post, Body, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { CreateSensorReadingDto } from './dto/create-sensor-reading.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('readings')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createSensorReadingDto: CreateSensorReadingDto) {
    const reading = await this.sensorsService.create(createSensorReadingDto);
    return {
      success: true,
      message: 'Sensor reading created successfully',
      data: reading,
    };
  }

  @Get('readings')
  async findAll(
    @Query('machineId') machineId?: string,
    @Query('limit') limit?: string,
  ) {
    const readings = await this.sensorsService.findAll(
      machineId,
      limit ? +limit : 100,
    );
    return {
      success: true,
      data: readings,
      count: readings.length,
    };
  }

  @Get('readings/latest')
  async findLatest(@Query('machineId') machineId: string) {
    if (!machineId) {
      return {
        success: false,
        message: 'machineId query parameter is required',
      };
    }

    const reading = await this.sensorsService.findLatest(machineId);
    return {
      success: true,
      data: reading,
    };
  }

  @Get('statistics')
  async getStatistics(
    @Query('machineId') machineId: string,
    @Query('hours') hours?: string,
  ) {
    if (!machineId) {
      return {
        success: false,
        message: 'machineId query parameter is required',
      };
    }

    const stats = await this.sensorsService.getStatistics(
      machineId,
      hours ? +hours : 24,
    );

    return {
      success: true,
      data: stats,
    };
  }
}
