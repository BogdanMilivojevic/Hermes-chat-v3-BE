import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dtos/register-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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
