import { ApiProperty } from '@nestjs/swagger';

export class UserLogged {
  @ApiProperty()
  access_token: string;
}
