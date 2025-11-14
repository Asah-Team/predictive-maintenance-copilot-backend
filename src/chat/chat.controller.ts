import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  SendMessageDto,
  QueryConversationsDto,
  SendMessageResponse,
  ConversationResponse,
} from './dto/chat.dto';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @GetUser('id') userId: string,
    @Body() dto: SendMessageDto,
  ): Promise<SendMessageResponse> {
    return this.chatService.sendMessage(userId, dto);
  }

  @Get('conversations')
  async getConversations(
    @GetUser('id') userId: string,
    @Query() query: QueryConversationsDto,
  ) {
    return this.chatService.getConversations(userId, query);
  }

  @Get('conversations/:id')
  async getConversation(
    @GetUser('id') userId: string,
    @Param('id') conversationId: string,
  ): Promise<ConversationResponse> {
    return this.chatService.getConversation(userId, conversationId);
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.OK)
  async deleteConversation(
    @GetUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.deleteConversation(userId, conversationId);
  }
}
