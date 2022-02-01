import { ApiProperty } from '@nestjs/swagger';
import { DocumentDto } from './document.dto';

export class PaginateDocumentDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  lastPage: number;

  @ApiProperty({ enum: ['DocumentDto'], default: [], isArray: true })
  data: DocumentDto[] = [];
}
