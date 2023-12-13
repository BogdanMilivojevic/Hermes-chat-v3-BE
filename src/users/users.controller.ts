import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
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
import { UsersSearchDto } from './dtos/user-search-dto';
import { UserRelationshipService } from './user-relationship.service';
import { FriendRequestDto } from './dtos/friend-request-dto';

@UseGuards(AuthenticationGuard)
@Controller('users')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private userRelationshipService: UserRelationshipService,
  ) {}

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

  @Get('/search')
  async userSearch(@Query() query: UsersSearchDto, @Req() request: Request) {
    const users = this.usersService.usersSearch(query, request);

    return users;
  }

  @Post('/friend-request')
  async sendFriendRequest(
    @Body() body: FriendRequestDto,
    @Req() request: Request,
  ) {
    const friendRequest = await this.userRelationshipService.create(
      request.user.id,
      body.id,
    );

    return friendRequest;
  }

  @Get('/friend-request')
  async indexFriendRequest(@Req() request: Request) {
    const usersFriendRequests =
      await this.userRelationshipService.index(request);

    return usersFriendRequests;
  }

  @Patch('/friend-request/:id')
  async updateFriendRequest(@Req() request: Request) {
    const resposne = await this.userRelationshipService.update(request);

    return resposne;
  }

  @Get('/friends')
  async indexFriends(@Req() request: Request) {
    const friends = await this.userRelationshipService.indexFriends(request);

    return friends;
  }

  @Delete('/friends/:id')
  async deleteFriend(@Req() request: Request) {
    const response = await this.userRelationshipService.deleteFriend(request);

    return response;
  }
}
