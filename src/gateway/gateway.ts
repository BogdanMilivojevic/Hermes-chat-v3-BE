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
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({ cors: true })
export class WsGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(private redisService: RedisService) {}

  onModuleInit() {
    const service = this.redisService;
    this.server.on('connection', (socket) => [
      socket.on('createRoom', async function (id) {
        //Check if there is a key
        const key = await service.hget(`user:${id}`, 'online');
        if (!key) {
          await service.hset(`user:${id}`, 'online', 1);
        }
        //If there is, increase by one
        if (key) {
          await service.hincrby(`user:${id}`, 'online', 1);
        }
        //If there is none, create one
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
    console.log(emitTo);

    emitTo.forEach((id) => {
      this.server.to(id).emit('onMessage', { message });
    });
  }

  @SubscribeMessage('setOnline')
  onSetOnline(@MessageBody() friends: any, request: Request) {
    const emitTo = [];

    //all members in the conversation
    friends.forEach((value) => {
      emitTo.push(+value.id);
    });

    emitTo.forEach((id) => {
      this.server.to(id).emit('onSetOnline', { id: request.user.id });
    });
  }
}
