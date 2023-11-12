import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './conversation.entity';
import { ConversationUser } from './conversation-user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([Conversation, ConversationUser, User]),
    AuthModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
