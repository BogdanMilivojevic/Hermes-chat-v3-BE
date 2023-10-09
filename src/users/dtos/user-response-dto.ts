import { Expose } from 'class-transformer';

export class UserResponseDto {
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
}
