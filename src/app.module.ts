import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { MachinesModule } from './machines/machines.module';
import { SensorsModule } from './sensors/sensors.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    MachinesModule, // Must be before SensorsModule (dependency)
    SensorsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
