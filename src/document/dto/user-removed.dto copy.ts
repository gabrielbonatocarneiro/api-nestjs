import { ApiProperty } from '@nestjs/swagger';

export class DocumentRemoved {
  @ApiProperty()
  message: string;
}
