import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.entity';
import { ConfigModule } from '@nestjs/config';
import { QueryModule } from './query/query.module';
import { UserRelationship } from './users/user-relationship.entity';
import { ConversationModule } from './conversation/conversation.module';
import { Conversation } from './conversation/conversation.entity';
import { ConversationUser } from './conversation/conversation-user.entity';
import { MessagesModule } from './messages/messages.module';
import { Message } from './messages/messages.entity';
import { File } from './messages/file.entity';
import { GatewayModule } from './gateway/gateway.module';
//IMPORT CONFIG MODULE FOR ENV BEFORE EVERYTHING SO THAT ENV CAN BE USED

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database:
        process.env.NODE_ENV === 'development'
          ? process.env.DB_DEV
          : process.env.DB_TEST,
      models: [
        User,
        UserRelationship,
        Conversation,
        ConversationUser,
        Message,
        File,
      ],
    }),
    UsersModule,
    AuthModule,
    QueryModule,
    ConversationModule,
    MessagesModule,
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
