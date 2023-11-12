import {
  BelongsTo,
  Column,
  ForeignKey,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Conversation } from 'src/conversation/conversation.entity';
import { User } from 'src/users/user.entity';
import { File } from './file.entity';

@Table
export class Message extends Model {
  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Conversation)
  @Column
  conversation_id: number;

  @Column
  text: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Conversation)
  conversation: Conversation;

  @HasOne(() => File, {
    foreignKey: 'attachable_type',
    constraints: false,
    scope: {
      attachableType: 'message',
    },
  })
  file: File;
}
