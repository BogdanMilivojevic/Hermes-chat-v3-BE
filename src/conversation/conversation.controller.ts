import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { CreateConversationDto } from './dtos/create-conversation.dto';
import { ConversationService } from './conversation.service';

@UseGuards(AuthenticationGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Post()
  async create(@Body() body: CreateConversationDto, @Req() req: Request) {
    const response = await this.conversationService.create(
      req.user.id,
      body.friendsId,
    );

    return response;
  }
}
