import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateSensorReadingSchema = z.object({
  productId: z
    .string()
    .min(1, 'Product ID must not be empty')
    .describe('Product ID from machine (e.g., M23839, L56160, H38406)'),
  airTemp: z
    .number()
    .min(0)
    .max(500, {
      message: 'airTemp must be between 0 and 500 Kelvin',
    })
    .describe('Air temperature [K]'),
  processTemp: z
    .number()
    .min(0)
    .max(500, {
      message: 'processTemp must be between 0 and 500 Kelvin',
    })
    .describe('Process temperature [K]'),
  rotationalSpeed: z
    .number()
    .int()
    .min(0)
    .max(10000, {
      message: 'rotationalSpeed must be between 0 and 10000 RPM',
    })
    .describe('Rotational speed [rpm]'),
  torque: z
    .number()
    .min(0)
    .max(200, {
      message: 'torque must be between 0 and 200 Nm',
    })
    .describe('Torque [Nm]'),
  toolWear: z
    .number()
    .int()
    .min(0)
    .max(1000, {
      message: 'toolWear must be between 0 and 1000 minutes',
    })
    .describe('Tool wear [min]'),
  timestamp: z.string().datetime().optional().describe('ISO 8601 datetime'),
});

export class CreateSensorReadingDto extends createZodDto(
  CreateSensorReadingSchema,
) {}

export type CreateSensorReadingInput = z.infer<
  typeof CreateSensorReadingSchema
>;
