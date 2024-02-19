import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UserRelationship } from './user-relationship.entity';
import { Op, QueryTypes } from 'sequelize';
import { User } from './user.entity';
import { Request } from 'express';
import { QueryService } from 'src/query/query.service';
import { RedisService } from 'src/redis/redis.service';
import { Conversation } from 'src/conversation/conversation.entity';

@Injectable()
export class UserRelationshipService {
  constructor(
    @InjectModel(UserRelationship)
    private userRelationshipModel: typeof UserRelationship,
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Conversation)
    private readonly conversationModel: typeof Conversation,
    private readonly queryService: QueryService,
    private redisService: RedisService,
  ) {}

  async create(senderId: number, receiverId: number) {
    if (senderId === receiverId)
      throw new BadRequestException('Cannot send friend request to self');

    //check if friendRequest already exists
    const pendingFriendRequests = await this.userRelationshipModel.findAll({
      where: {
        sender_user_id: senderId,
        [Op.and]: {
          type: 'pending',
        },
      },
    });

    const receivingUsersIds = pendingFriendRequests.map(
      (value) => value.receiver_user_id,
    );

    if (receivingUsersIds.includes(receiverId))
      throw new BadRequestException('Friend Request already exists');

    const friendRequest = await this.userRelationshipModel.create({
      sender_user_id: senderId,
      receiver_user_id: receiverId,
    });

    return friendRequest;
  }

  async index(request: Request) {
    // const path = request.path.split('/').slice(-1)[0];
    const queryValues = ['sent', 'received'];
    const type = request.query.type as 'sent' | 'received';
    if (!queryValues.includes(type))
      throw new BadRequestException('Wrong query parameters');

    const fieldOne = type === 'sent' ? 'sender_user_id' : 'receiver_user_id';
    const usersFriendRequests = await this.userRelationshipModel.findAll({
      where: {
        [fieldOne]: request.user.id,
        [Op.and]: {
          type: 'pending',
        },
      },
    });

    if (usersFriendRequests.length > 0) {
      const response = [];
      await Promise.all(
        usersFriendRequests.map(async (value) => {
          let userId = value.receiver_user_id;
          if (type !== 'sent') {
            userId = value.sender_user_id;
          }

          const user = await this.userModel.findOne({
            where: {
              id: userId,
            },
          });

          if (user)
            response.push({ relationshipId: value.id, ...user.dataValues });
        }),
      );

      return response;
    }

    return usersFriendRequests;
  }

  async update(request: Request) {
    const queryValues = ['accept', 'decline'];
    const type = request.query.type as 'accept' | 'decline';
    if (!queryValues.includes(type))
      throw new BadRequestException('Wrong query parameters');

    const friendRequest = await this.userRelationshipModel.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!friendRequest) throw new NotFoundException('Friend Request not found');

    if (type === 'accept') {
      await UserRelationship.update(
        {
          type: 'friend',
        },
        {
          where: {
            id: request.params.id,
          },
        },
      );

      return 'friend request accepted';
    }

    await UserRelationship.destroy({
      where: {
        id: request.params.id,
      },
    });

    return 'friend request declined';
  }

  async indexFriends(id: number) {
    const usersFriends = await this.userRelationshipModel.findAll({
      where: {
        [Op.or]: [{ sender_user_id: id }, { receiver_user_id: id }],
        [Op.and]: [{ type: 'friend' }],
      },
    });

    if (usersFriends.length > 0) {
      const response = [];
      await Promise.all(
        usersFriends.map(async (value) => {
          const userId =
            value.sender_user_id === id
              ? value.receiver_user_id
              : value.sender_user_id;
          const user = await this.userModel.findOne({
            where: {
              id: userId,
            },
          });

          const users = [id, user.id];

          const conversationId =
            await this.userRelationshipModel.sequelize.query(
              this.queryService.findConversation(users),
              { type: QueryTypes.SELECT },
            );

          if (conversationId.length > 0) {
            const [id] = Object.values(conversationId[0]);

            const conversation = await this.conversationModel.findOne({
              where: {
                id: id,
              },
            });
            response.push({
              ...user.dataValues,
              conversationId: id,
              lastMessage: conversation.last_message,
            });
          }

          if (conversationId.length === 0) {
            response.push({
              ...user.dataValues,
            });
          }
        }),
      );

      await Promise.all(
        response.map(async (res) => {
          const online = await this.redisService.hget(
            `user:${res.id}`,
            'online',
          );

          if (+online > 0) {
            res.online = true;
          }

          if (+online === 0) {
            res.online = false;
          }

          if (!online) {
            res.online = false;
          }
        }),
      );

      return response;
    }

    return usersFriends;
  }

  async deleteFriend(request: Request) {
    const friendship = this.userRelationshipModel.findOne({
      where: {
        id: request.params.id,
      },
    });

    if (!friendship) throw new NotFoundException('Friendship not found');

    await this.userRelationshipModel.destroy({
      where: {
        id: request.params.id,
      },
    });

    return 'friend deleted successfully';
  }
}
