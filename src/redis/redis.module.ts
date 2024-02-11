import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisModuleConfigService } from './redis.config';
import { RedisService } from './redis.service';
@Module({
  imports: [
    RedisModule.forRootAsync({
      useClass: RedisModuleConfigService,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisCacheModule {}
