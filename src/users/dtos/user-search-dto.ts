import { IsString } from 'class-validator';

export class UsersSearchDto {
  @IsString()
  username: string;
}
