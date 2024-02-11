import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from './messages.entity';
import { AuthModule } from 'src/auth/auth.module';
import { File } from './file.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { WsGateway } from 'src/gateway/gateway';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Message, File]),
    AuthModule,
    ConversationModule,
    RedisCacheModule,
  ],
  controllers: [MessagesController],
  providers: [MessagesService, WsGateway],
})
export class MessagesModule {}
