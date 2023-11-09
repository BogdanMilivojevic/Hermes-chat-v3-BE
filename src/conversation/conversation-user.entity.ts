import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Conversation } from './conversation.entity';
import { User } from 'src/users/user.entity';

@Table
export class ConversationUser extends Model {
  @ForeignKey(() => Conversation)
  @Column
  conversation_id: number;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Conversation)
  conversation: Conversation;
}
