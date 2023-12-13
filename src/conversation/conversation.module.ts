import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Conversation } from './conversation.entity';
import { ConversationUser } from './conversation-user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/users/user.entity';
import { Message } from 'src/messages/messages.entity';
import { File } from 'src/messages/file.entity';
import { QueryModule } from 'src/query/query.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Conversation,
      ConversationUser,
      User,
      Message,
      File,
    ]),
    AuthModule,
    QueryModule,
  ],
  controllers: [ConversationController],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {}
