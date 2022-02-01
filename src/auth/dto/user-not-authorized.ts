import { ApiProperty } from '@nestjs/swagger';

export class UserNotAuthorized {
  @ApiProperty()
  statusCode: string;

  @ApiProperty()
  message: string;
}
