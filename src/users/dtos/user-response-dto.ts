import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  public id: number;

  @Expose()
  public username: string;

  @Expose()
  public email: string;

  @Expose()
  public photo_id: string;

  @Expose()
  public createdAt: string;

  @Expose()
  public updatedAt: string;

  @Expose()
  public type: string;

  @Expose()
  public relationshipId: number;

  @Expose()
  public conversationId: number;

  @Expose()
  public token: string;
}
