import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.entity';
import { AuthModule } from 'src/auth/auth.module';
import { File } from './file.entity';
import { ConversationModule } from 'src/conversation/conversation.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, File]),
    AuthModule,
    ConversationModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
