import { Module } from '@nestjs/common';
import { SocketGateway } from './socketutils/websocket.gateway';

@Module({
  providers: [SocketGateway],
})
export class SocketModule {}
