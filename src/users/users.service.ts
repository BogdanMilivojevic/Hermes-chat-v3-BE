import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';

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
}
