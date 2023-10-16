import { IsString } from 'class-validator';

export class UpdateUserPassword {
  @IsString()
  newPassword: string;

  @IsString()
  originalPassword: string;
}
