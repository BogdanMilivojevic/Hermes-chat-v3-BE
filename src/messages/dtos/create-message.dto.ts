import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import { IsArray } from 'class-validator';

export class CreateMessageDto {
  @Optional()
  friendsId: number[];

  @Optional()
  text: string;

  @Optional()
  @Type(() => Number)
  conversationId?: number;
}
