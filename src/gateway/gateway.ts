import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, OnModuleInit } from '@nestjs/common';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'socket.io';
import { Message } from 'src/messages/messages.entity';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => [
      socket.on('createRoom', async function (id) {
        socket.join(id);
      }),

      socket.on('disconnect', () => {
        console.log('A user has disconnected');
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
      this.server.to(id).emit('onMessage', { ...message });
    });
  }

  @SubscribeMessage('setOnlineStatus')
  onSetOnline(@MessageBody() friends: any, userId: number, status: boolean) {
    const emitTo = [];

    //all members in the conversation
    friends.forEach((value) => {
      emitTo.push(+value.id);
    });

    emitTo.forEach((id) => {
      this.server.to(id).emit('onSetOnlineStatus', {
        id: userId,
        online: status,
      });
    });
  }
}
