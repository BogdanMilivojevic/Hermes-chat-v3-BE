import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { QueryService } from 'src/query/query.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, QueryService],
  imports: [SequelizeModule.forFeature([User]), AuthModule],
  exports: [UsersService],
})
export class UsersModule {}
