import {
  BeforeCreate,
  BeforeUpdate,
  Column,
  Model,
  Table,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

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
