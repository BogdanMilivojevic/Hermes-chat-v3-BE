import { BelongsToMany, HasMany, Model, Table } from 'sequelize-typescript';
import { ConversationUser } from './conversation-user.entity';
import { User } from 'src/users/user.entity';

@Table
export class Conversation extends Model {
  @HasMany(() => ConversationUser)
  conversationUser: ConversationUser[];

  @BelongsToMany(() => User, () => ConversationUser)
  users: User[];
}
