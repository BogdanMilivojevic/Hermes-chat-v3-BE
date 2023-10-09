import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Request } from 'express';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserResponseDto } from 'src/users/dtos/user-response-dto';

@Serialize(UserResponseDto)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthenticationGuard)
  @Get('/me')
  showUser(@Req() request: Request) {
    return this.authService.getMe(request.user.id);
  }

  @Post('/register')
  async register(@Body() body: RegisterUserDto) {
    const token = await this.authService.registerUser(
      body.username,
      body.email,
      body.password,
    );

    return token;
  }

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    const token = await this.authService.loginUser(body.email, body.password);

    return token;
  }
}
