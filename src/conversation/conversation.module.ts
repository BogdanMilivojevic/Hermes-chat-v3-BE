import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './conversation.entity';
import { ConversationUser } from './conversation-user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [
    SequelizeModule.forFeature([Conversation, ConversationUser, User]),
    AuthModule,
  ],
})
export class ConversationModule {}
