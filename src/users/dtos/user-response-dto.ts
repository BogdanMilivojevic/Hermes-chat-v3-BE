import { Expose } from 'class-transformer';
import { User } from '../user.entity';

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

  @Expose()
  public type: string;

  @Expose()
  public relationshipId: number;
}
