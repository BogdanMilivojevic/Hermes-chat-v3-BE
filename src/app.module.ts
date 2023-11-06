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
      models: [User, UserRelationship],
    }),
    UsersModule,
    AuthModule,
    QueryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
