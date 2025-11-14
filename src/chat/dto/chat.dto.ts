import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// ========================================
// Send Message DTO
// ========================================
export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000),
  conversationId: z.string().uuid().optional(),
  machineId: z.string().uuid().optional(),
});

export class SendMessageDto extends createZodDto(sendMessageSchema) {}

// ========================================
// Query Conversations DTO
// ========================================
export const queryConversationsSchema = z.object({
  limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  offset: z.coerce.number().int().min(0).default(0).optional(),
  machineId: z.string().uuid().optional(),
});

export class QueryConversationsDto extends createZodDto(
  queryConversationsSchema,
) {}

// ========================================
// Response DTOs (for type safety)
// ========================================
export interface MessageResponse {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

export interface ConversationResponse {
  id: string;
  title: string;
  machineId: string | null;
  totalMessages: number;
  lastMessageAt: Date | null;
  createdAt: Date;
  messages?: MessageResponse[];
}

export interface SendMessageResponse {
  conversation: ConversationResponse;
  message: MessageResponse;
  aiResponse: MessageResponse;
}
