import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { QueryService } from 'src/query/query.service';
import { UserRelationship } from './user-relationship.entity';
import { UserRelationshipService } from './user-relationship.service';
import { QueryModule } from 'src/query/query.module';
import { WsGateway } from 'src/gateway/gateway';
import { RedisCacheModule } from 'src/redis/redis.module';
import { Conversation } from 'src/conversation/conversation.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserRelationship, Conversation]),
    AuthModule,
    QueryModule,
    RedisCacheModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, QueryService, UserRelationshipService, WsGateway],
  exports: [UsersService, UserRelationshipService],
})
export class UsersModule {}
