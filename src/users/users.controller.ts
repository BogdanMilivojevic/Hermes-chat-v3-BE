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

@UseGuards(AuthenticationGuard)
@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseInterceptors(FileInterceptor('file', uploadProfilePicture))
  @Patch('/me')
  async updateUser(
    @Body() body: UpdateUserDto,
    @UploadedFile() file,
    @Req() request: Request,
  ) {
    return this.usersService.update(request.user.id, body, file);
  }
}
