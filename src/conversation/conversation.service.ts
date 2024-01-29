import { Injectable, NotFoundException, Post, Get } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conversation } from './conversation.entity';
import { ConversationUser } from './conversation-user.entity';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/user.entity';
import { Message } from 'src/messages/messages.entity';
import { Request } from 'express';
import { File } from 'src/messages/file.entity';
import { QueryService } from 'src/query/query.service';
import { QueryTypes } from 'sequelize';
import { MessageRes } from 'src/utils/interfaces';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation) private conversationModel: typeof Conversation,
    private sequelize: Sequelize,
    @InjectModel(ConversationUser)
    private conversationUserModel: typeof ConversationUser,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Message) private messageModel: typeof Message,
    @InjectModel(File) private fileModel: typeof File,
    private readonly queryService: QueryService,
  ) {}

  async create(userId: number, friendsId: number[]) {
    const t = await this.sequelize.transaction();

    try {
      await Promise.all(
        friendsId.map(async (userId) => {
          const friend = await this.userModel.findOne({
            where: {
              id: userId,
            },
          });

          if (!friend) throw new NotFoundException('User not found');
        }),
      );

      const conversation = await this.conversationModel.create(
        {},
        { transaction: t },
      );

      await this.conversationUserModel.create(
        {
          conversation_id: conversation.id,
          user_id: userId,
        },
        { transaction: t },
      );

      await Promise.all(
        friendsId.map(async (userId) => {
          await this.conversationUserModel.create(
            {
              conversation_id: conversation.id,
              user_id: userId,
            },
            { transaction: t },
          );
        }),
      );

      await t.commit();
      return conversation;
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw error;
    }
  }

  async show(request: Request) {
    const queryLimit = +request.query.limit * 10 || 100;
    const messagesLimit = request.query.limit || 10;

    const conversation: MessageRes[] =
      await this.conversationUserModel.sequelize.query(
        this.queryService.getConversation(request.params.id, +queryLimit),
        { type: QueryTypes.SELECT },
      );

    let prevMessageId: number = 0;
    let nextMessageId: number = 0;
    const skippedDuplicates: number[] = [];
    for (let i = 0; i < conversation.length; i++) {
      const url: string[] = [];
      prevMessageId = conversation[i - 1]?.id;
      nextMessageId = conversation[i + 1]?.id;

      if (
        conversation[i].id === prevMessageId &&
        !skippedDuplicates.includes(i)
      ) {
        let nextId = 1;
        const indexesToRemove = [];

        while (conversation[i].id === conversation[i + nextId]?.id) {
          if (!indexesToRemove.includes(i)) {
            indexesToRemove.push(i);
          }

          indexesToRemove.push(i + nextId);
          nextId += 1;
        }
        //if original's message url propery is not array, convert it to it
        if (!Array.isArray(conversation[i - 1])) {
          url.push(conversation[i - 1].url as string);
          delete conversation[i - 1].url;
          conversation[i - 1].url = url;
        }

        if (indexesToRemove.length === 0) {
          (conversation[i - 1].url as string[]).push(
            conversation[i].url as string,
          );
          skippedDuplicates.push(i);
        }

        //for every subsequent duplicate pass its string value to original's message url array property
        indexesToRemove.forEach((index) => {
          (conversation[i - 1].url as string[]).push(
            conversation[index].url as string,
          );
          skippedDuplicates.push(index);
        });
      }

      if (
        conversation[i].url &&
        conversation[i].id !== nextMessageId &&
        !skippedDuplicates.includes(i)
      ) {
        url.push(conversation[i].url as string);
        delete conversation[i].url;
        conversation[i].url = url;
      }
    }

    //out of all messages filter out the duplicates
    const filterdConveration = conversation
      .filter((val, index) => {
        return skippedDuplicates.indexOf(index) === -1;
      })
      .slice(0, +messagesLimit)
      .reverse();

    return filterdConveration;
  }
}
