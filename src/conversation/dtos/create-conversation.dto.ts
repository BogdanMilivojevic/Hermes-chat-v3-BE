import { IsArray } from 'class-validator';

export class CreateConversationDto {
  @IsArray()
  friendsId: number[];
}
