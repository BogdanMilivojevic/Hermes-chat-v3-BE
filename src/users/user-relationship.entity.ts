import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.entity';

enum UserRelationshipType {
  friend = 'friend',
  pending = 'pending',
}

@Table
export class UserRelationship extends Model {
  @ForeignKey(() => User)
  @Column
  sender_user_id: number;

  @ForeignKey(() => User)
  @Column
  receiver_user_id: number;

  @Column({
    defaultValue: 'pending',
    type: DataType.ENUM(...Object.values(UserRelationshipType)),
  })
  type!: UserRelationshipType;

  @BelongsTo(() => User)
  user: User;
}
