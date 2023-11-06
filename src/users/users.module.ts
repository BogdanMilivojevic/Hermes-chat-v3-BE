import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { QueryService } from 'src/query/query.service';
import { UserRelationship } from './user-relationship.entity';
import { UserRelationshipService } from './user-relationship.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, QueryService, UserRelationshipService],
  imports: [SequelizeModule.forFeature([User, UserRelationship]), AuthModule],
  exports: [UsersService],
})
export class UsersModule {}
