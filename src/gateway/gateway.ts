import { OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server, Socket } from 'socket.io';
import { Message } from 'src/messages/messages.entity';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => [
      socket.on('createRoom', function (room) {
        console.log(room);
        socket.join(room);
      }),
    ]);
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any, request: Request, message: Message) {
    const emitTo = [];

    //all members in the conversation
    body.friendsId.forEach((value) => {
      emitTo.push(+value);
    });

    //plus the sender id
    emitTo.push(request.user.id);

    emitTo.forEach((id) => {
      this.server.to(id).emit('onMessage', { message });
    });
  }
}
