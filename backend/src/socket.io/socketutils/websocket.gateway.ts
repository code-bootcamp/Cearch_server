import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(5000, {
  cors: {
    origin: 'http://127.0.0.1:5500',
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  public handleConnection(client: Socket) {
    console.log(`${client.id} Hi~~`);
    this.server.emit('join', { id: client.id });
  }

  public handleDisconnect(client: Socket) {
    console.log(`${client.id} Bye~~`);
    this.server.emit('leave', { id: client.id });
  }

  @SubscribeMessage('client message')
  sendMessage(client: Socket, message: any): void {
    console.log('socket room : ', client.rooms);
    console.log(message);
    this.server.to(message.roomNum).emit('server message', message.message);
  }

  @SubscribeMessage('join room')
  enterChatroom(client: Socket, message: any) {
    client.join(message.roomNum);
    console.log(`${client.id} 님이 ${message.roomNum}에 들어가셨습니다.`);
  }

  @SubscribeMessage('leave room')
  leaveChatroom(client: Socket, message: any) {
    client.leave(message.roomNum);
    console.log(`${client.id} 님이 ${message.roomNum}에 나가셨습니다.`);
  }
}
