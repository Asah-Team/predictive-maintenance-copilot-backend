import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

/**
 * Zod schema for machine creation
 * Validates machine data from predictive maintenance dataset
 */
export const CreateMachineSchema = z.object({
  productId: z
    .string()
    .min(1, 'Product ID must not be empty')
    .max(50, 'Product ID must not exceed 50 characters')
    .describe('Product ID from dataset (e.g., M23839, L56160, H38406)'),

  type: z
    .enum(['L', 'M', 'H'])
    .describe('Machine type: L (Low), M (Medium), H (High)'),
});

/**
 * DTO for creating a new machine
 * Extends Zod schema with NestJS validation integration
 */
export class CreateMachineDto extends createZodDto(CreateMachineSchema) {}

export type CreateMachineInput = z.infer<typeof CreateMachineSchema>;
