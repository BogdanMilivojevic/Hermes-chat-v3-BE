import {
  Body,
  Controller,
  Patch,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserResponseDto } from './dtos/user-response-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { uploadProfilePicture } from 'src/utils/multerOptions';
import { AuthenticationGuard } from 'src/guards/authentication.guard';
import { Request } from 'express';
import { UpdateUserPassword } from './dtos/update-user-password-dto';

@UseGuards(AuthenticationGuard)
@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file', uploadProfilePicture))
  @Patch('/me')
  async updateUser(
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
  ) {
    return this.usersService.update(request.user.id, body, file);
  }

  @Patch('/password/me')
  async updateUserPassword(
    @Body() body: UpdateUserPassword,
    @Req() request: Request,
  ) {
    const res = await this.usersService.updateUserPassword(
      request.user.id,
      body,
    );

    return res.message;
  }
}
