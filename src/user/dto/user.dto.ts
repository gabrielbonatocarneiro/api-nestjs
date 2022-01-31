import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  user_id: bigint;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
