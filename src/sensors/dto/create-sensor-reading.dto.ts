import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateSensorReadingSchema = z.object({
  machineId: z.string().uuid({
    message: 'machineId must be a valid UUID',
  }),
  airTemp: z.number().min(0).max(500, {
    message: 'airTemp must be between 0 and 500 Kelvin',
  }),
  processTemp: z.number().min(0).max(500, {
    message: 'processTemp must be between 0 and 500 Kelvin',
  }),
  rotationalSpeed: z.number().int().min(0).max(10000, {
    message: 'rotationalSpeed must be between 0 and 10000 RPM',
  }),
  torque: z.number().min(0).max(200, {
    message: 'torque must be between 0 and 200 Nm',
  }),
  toolWear: z.number().int().min(0).max(1000, {
    message: 'toolWear must be between 0 and 1000 minutes',
  }),
  timestamp: z.string().datetime().optional(),
});

export class CreateSensorReadingDto extends createZodDto(CreateSensorReadingSchema) {}

export type CreateSensorReadingInput = z.infer<typeof CreateSensorReadingSchema>;
