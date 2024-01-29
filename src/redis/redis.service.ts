import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis()
    private readonly connection: Redis,
  ) {}

  async get(key: string) {
    const value = await this.connection.get(key);
    return value;
  }

  async set(key: string, value: string) {
    await this.connection.set(key, value);
  }

  async hset(key: string, field: string, value: string | number) {
    await this.connection.hset(key, field, value);
  }

  async hget(key: string, field: string) {
    const hash = await this.connection.hget(key, field);
    return hash;
  }

  async hincrby(key: string, field: string, number: number) {
    await this.connection.hincrby(key, field, number);
  }
}
