import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import helpers from 'src/utils/helpers';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { UpdateUserPassword } from './dtos/update-user-password-dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async create(username: string, email: string, password: string) {
    const user = await this.userModel.create({
      username,
      email,
      password,
    });

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });

    return user;
  }

  async findById(id: number) {
    const user = await this.userModel.findOne({
      where: {
        id,
      },
    });

    return user;
  }

  async update(id: number, data: Partial<User>, file) {
    const user = await this.userModel.findOne({
      where: { id },
    });

    if (file) {
      data.photo_id = file.path;

      if (user.photo_id) {
        const filePath = path.resolve(user.photo_id);
        await helpers.deleteFile(filePath);
      }
    }

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.userModel.update(data, {
      where: { id },
      returning: true,
    });

    return updatedUser;
  }

  async updateUserPassword(id: number, data: UpdateUserPassword) {
    const user = await this.userModel.findOne({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    const compareOriginalPassword = await bcrypt.compare(
      data.originalPassword,
      user.password,
    );

    if (!compareOriginalPassword)
      throw new UnauthorizedException('Original password not correct');

    const { newPassword } = data;

    await this.userModel.update(
      {
        password: newPassword,
      },
      {
        where: {
          id,
        },
        individualHooks: true,
      },
    );

    return {
      message: 'Password updated succesfully',
    };
  }
}
