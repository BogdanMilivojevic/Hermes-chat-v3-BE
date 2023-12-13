import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Message } from './messages.entity';
import { Request } from 'express';
import { ConversationService } from 'src/conversation/conversation.service';
import { Sequelize } from 'sequelize-typescript';
import { File } from './file.entity';
import { CreateMessageDto } from './dtos/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message) private messageModel: typeof Message,
    private readonly conversationService: ConversationService,
    private readonly sequelize: Sequelize,
    @InjectModel(File) private readonly fileModel: typeof File,
  ) {}

  async create(
    req: Request,
    body: CreateMessageDto,
    files: Array<Express.Multer.File>,
  ) {
    const t = await this.sequelize.transaction();

    try {
      let conversation;
      if (!body.conversationId) {
        conversation = await this.conversationService.create(
          req.user.id,
          body.friendsId,
        );
      }

      const message = await this.messageModel.create(
        {
          conversation_id: body.conversationId
            ? body.conversationId
            : conversation.id,
          user_id: req.user.id,
          text: body.text,
        },
        { transaction: t },
      );

      if (files) {
        await Promise.all(
          files.map(async (file) => {
            await this.fileModel.create(
              {
                attachable_type: 'message',
                attachable_id: message.id,
                url: file.path,
              },
              { transaction: t },
            );
          }),
        );
      }

      await t.commit();

      let response;
      if (files) {
        const url = [];
        files.map(async (file) => {
          url.push(file.path);
        });
        response = {
          id: message.id,
          user_id: message.user_id,
          text: message.text,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          url,
        };
      }

      return response;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw error;
    }
  }
}
