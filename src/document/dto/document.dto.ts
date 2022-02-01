import { ApiProperty } from '@nestjs/swagger';

export class DocumentDto {
  @ApiProperty()
  document_id: bigint;

  @ApiProperty()
  user_id: bigint;

  @ApiProperty()
  international: boolean;

  @ApiProperty()
  name: string;

  @ApiProperty()
  number: string;

  @ApiProperty()
  complement: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
