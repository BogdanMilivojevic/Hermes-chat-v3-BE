import {
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { UserRelationship } from './user-relationship.entity';
import { ConversationUser } from 'src/conversation/conversation-user.entity';
import { Conversation } from 'src/conversation/conversation.entity';
import { Message } from 'src/messages/messages.entity';

@Table
export class User extends Model {
  @Column
  username: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  photo_id: string;

  @HasMany(() => UserRelationship)
  userRelationship: UserRelationship[];

  @HasMany(() => ConversationUser)
  conversationUser: ConversationUser[];

  @BelongsToMany(() => Conversation, () => ConversationUser)
  conversations: Conversation[];

  @HasMany(() => Message)
  messages: Message[];

  @BeforeCreate
  static async hashPassword(user: User) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    user.password = hashedPassword;
  }

  @BeforeUpdate
  static async hashUpdatedPassword(user: User) {
    if (user.changed('password')) {
      const hashedPassword = await bcrypt.hash(user.password, 12);
      user.password = hashedPassword;
    }
  }
}
