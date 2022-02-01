import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class CreateDocumentDto {
  @ApiProperty({ required: true })
  @IsBoolean()
  international: boolean;

  @ApiProperty({ required: true })
  name: string;

  @ApiProperty({ required: true })
  number: string;

  @ApiProperty({ required: false })
  complement: string;
}
