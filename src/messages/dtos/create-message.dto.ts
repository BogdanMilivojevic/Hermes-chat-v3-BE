import { IsArray, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsArray()
  friendsId: number[];

  @IsString()
  text: string;

  @IsString()
  conversationId?: number;
}
