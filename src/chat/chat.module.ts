import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiAgentService } from './ai-agent.service';
import { PrismaModule } from '../common/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [ChatController],
  providers: [ChatService, AiAgentService],
  exports: [ChatService, AiAgentService],
})
export class ChatModule {}
