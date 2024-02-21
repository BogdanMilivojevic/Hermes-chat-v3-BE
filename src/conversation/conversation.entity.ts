import {
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ConversationUser } from './conversation-user.entity';
import { User } from 'src/users/user.entity';
import { Message } from 'src/messages/messages.entity';

@Table
export class Conversation extends Model {
  @Column
  last_message: string;

  @Column
  last_message_sender: number;

  @HasMany(() => ConversationUser)
  conversationUser: ConversationUser[];

  @BelongsToMany(() => User, () => ConversationUser)
  users: User[];

  @HasMany(() => Message)
  messages: Message[];
}
