import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import helpers from 'src/utils/helpers';
import * as path from 'path';

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

      const filePath = path.resolve(user.photo_id);

      if (user.photo_id) {
        await helpers.deleteFile(filePath);
      }
    }

    if (!user) throw new NotFoundException('User not found');

    const updatedUser = await this.userModel.update(data, {
      where: { id },
      individualHooks: true,
      returning: true,
    });

    return updatedUser;
  }
}
