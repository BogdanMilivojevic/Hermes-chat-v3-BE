import { Injectable, NotFoundException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Conversation } from './conversation.entity';
import { ConversationUser } from './conversation-user.entity';
import { Sequelize } from 'sequelize-typescript';
import { User } from 'src/users/user.entity';

@Injectable()
export class ConversationService {
  constructor(
    @InjectModel(Conversation) private conversationModel: typeof Conversation,
    private sequelize: Sequelize,
    @InjectModel(ConversationUser)
    private conversationUserModel: typeof ConversationUser,
    @InjectModel(User) private userModel: typeof User,
  ) {}

  @Post()
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
      return 'conversation created';
    } catch (error) {
      console.log(error);
      await t.rollback();
      throw error;
    }
  }
}
