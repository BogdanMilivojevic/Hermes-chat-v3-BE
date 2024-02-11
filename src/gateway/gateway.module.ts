import { Module } from '@nestjs/common';
import { WsGateway } from './gateway';
import { RedisCacheModule } from 'src/redis/redis.module';

@Module({
  providers: [WsGateway],
  imports: [RedisCacheModule],
  exports: [WsGateway],
})
export class GatewayModule {}