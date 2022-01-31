import { ApiProperty } from '@nestjs/swagger';

export class UserRemoved {
  @ApiProperty()
  message: string;
}
