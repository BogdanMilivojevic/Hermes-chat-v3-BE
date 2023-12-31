import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async registerUser(username: string, email: string, password: string) {
    try {
      const user = await this.usersService.create(username, email, password);

      const token = await this.jwtService.signAsync({ id: user.id });

      return token;
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new BadRequestException({
          status: 422,
          message: `${Object.keys(error.fields)[0]} is already in use`,
        });
      }
      throw new BadRequestException({
        status: 500,
        message: `Something went wrong`,
      });
    }
  }

  async loginUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Email or password incorrect');

    const comparison = await bcrypt.compare(password, user.password);

    if (!comparison)
      throw new UnauthorizedException('Email or password incorrect');

    const token = await this.jwtService.signAsync({ id: user.id });

    return token;
  }

  async getMe(id: number) {
    const user = await this.usersService.findById(id);

    if (!user) throw new NotFoundException('No user found');

    return user;
  }
}
