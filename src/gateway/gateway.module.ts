import { Module } from '@nestjs/common';
import { WsGateway } from './gateway';

@Module({
  providers: [WsGateway],
  exports: [WsGateway],
})
export class GatewayModule {}
