import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Message } from 'src/messages/messages.entity';

enum AttachableType {
  message = 'message',
}

@Table
export class File extends Model {
  @Column
  url: string;

  @ForeignKey(() => Message)
  @Column
  attachable_id: number;

  @Column({
    type: DataType.ENUM(...Object.values(AttachableType)),
  })
  attachable_type: AttachableType;

  @BelongsTo(() => Message, {
    foreignKey: 'attachable_id',
    constraints: false,
  })
  message: Message;
}
