import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ConversationService } from './conversation.service';
import { Request } from 'express';

@UseGuards(AuthenticationGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get('/:id')
  async show(@Req() request: Request) {
    const conversation = await this.conversationService.show(request);

    return conversation;
  }
}
