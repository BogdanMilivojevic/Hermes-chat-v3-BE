import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QueryModule } from 'src/query/query.module';
import { RedisCacheModule } from 'src/redis/redis.module';
import { UserRelationshipService } from 'src/users/user-relationship.service';
import { UserRelationship } from 'src/users/user-relationship.entity';
import { GatewayModule } from 'src/gateway/gateway.module';
import { Conversation } from 'src/conversation/conversation.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([User, UserRelationship, Conversation]),
    QueryModule,
    GatewayModule,
    RedisCacheModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  providers: [AuthService, UsersService, UserRelationshipService],
  controllers: [AuthController],
  exports: [JwtModule],
})
export class AuthModule {}
