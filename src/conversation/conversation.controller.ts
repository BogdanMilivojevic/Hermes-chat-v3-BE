import { Controller, UseGuards } from '@nestjs/common';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { ConversationService } from './conversation.service';

@UseGuards(AuthenticationGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}
}
