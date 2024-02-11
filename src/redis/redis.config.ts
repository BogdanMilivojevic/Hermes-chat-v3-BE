import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  RedisModuleOptions,
  RedisModuleOptionsFactory,
} from '@nestjs-modules/ioredis';

@Injectable()
export class RedisModuleConfigService implements RedisModuleOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  onModuleInit() {
    console.log('Redis is connected successfully');
  }

  createRedisModuleOptions(): RedisModuleOptions | Promise<RedisModuleOptions> {
    return {
      type: 'single',
      options: { host: process.env.REDIS_HOST, port: +process.env.REDIS_PORT },
    };
  }
}
