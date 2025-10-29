import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { SensorsRealtimeGateway } from './sensors-realtime.gateway';
import { SupabaseRealtimeService } from './supabase-realtime.service';
import { MachinesModule } from '../machines/machines.module';

@Module({
  imports: [MachinesModule], // Import MachinesModule for machine validation
  controllers: [SensorsController],
  providers: [SensorsService, SensorsRealtimeGateway, SupabaseRealtimeService],
  exports: [SensorsService],
})
export class SensorsModule {}
