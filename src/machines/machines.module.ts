import { Module } from '@nestjs/common';
import { MachinesService } from './machines.service';
import { MachinesController } from './machines.controller';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Machines Module
 * Provides machine management functionality and exports MachinesService
 * for use in dependent modules (e.g., SensorsModule)
 *
 * @module MachinesModule
 * @exports MachinesService - For machine validation and operations in other modules
 */
@Module({
  imports: [PrismaModule],
  controllers: [MachinesController],
  providers: [MachinesService],
  exports: [MachinesService], // Export for use in SensorsModule
})
export class MachinesModule {}
