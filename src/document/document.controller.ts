import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  Put,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import * as moment from 'moment';
import { JwtAuthGuard } from 'src/auth/configs/jwt-auth.guard';
import { DocumentService } from './document.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentDto } from './dto/document.dto';
import { PaginateDocumentDto } from './dto/paginate-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { DocumentRemoved } from './dto/user-removed.dto copy';

@ApiTags('Document')
@Controller('api/document')
export class DocumentController {
  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'perPage', required: false })
  @ApiOkResponse({ type: PaginateDocumentDto })
  @ApiBearerAuth('JWT')
  async findAll(
    @Request() req: any,
    @Query('page') qPage: string,
    @Query('perPage') qPerPage: string,
    @Res() res: any,
  ) {
    const { userId } = req;
    const page = Number(qPage) || 1;
    const perPage = Number(qPerPage) || 10;

    const result = await this.documentService.findAll(userId, page, perPage);

    const data: any[] = [];

    result.data.forEach((document) => {
      data.push({
        ...document,
        document_id: Number(document.document_id),
        user_id: Number(document.user_id),
        international: !!document.international,
        created_at: moment(document.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(document.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    });

    return res.status(HttpStatus.OK).json({
      ...result,
      data,
    });
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: DocumentDto })
  @ApiNotFoundResponse()
  @ApiBearerAuth('JWT')
  async findOne(@Request() req: any, @Param('id') id: number, @Res() res: any) {
    const { userId } = req;

    try {
      const document = await this.documentService.findOne(userId, id);

      return res.status(HttpStatus.OK).json({
        ...document,
        document_id: Number(document.document_id),
        user_id: Number(document.user_id),
        international: !!document.international,
        created_at: moment(document.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(document.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: CreateDocumentDto })
  @ApiCreatedResponse({ type: DocumentDto })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  async create(
    @Request() req: any,
    @Body() createDocumentDto: CreateDocumentDto,
    @Res() res: any,
  ) {
    const { userId } = req;

    try {
      const document = await this.documentService.create(
        userId,
        createDocumentDto,
      );

      return res.status(HttpStatus.OK).json({
        ...document,
        document_id: Number(document.document_id),
        user_id: Number(document.user_id),
        international: !!document.international,
        created_at: moment(document.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(document.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateDocumentDto })
  @ApiCreatedResponse({ type: DocumentDto })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  async update(
    @Request() req: any,
    @Param('id') id: number,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Res() res: any,
  ) {
    const { userId } = req;

    try {
      const document = await this.documentService.update(
        userId,
        id,
        updateDocumentDto,
      );

      return res.status(HttpStatus.OK).json({
        ...document,
        document_id: Number(document.document_id),
        user_id: Number(document.user_id),
        international: !!document.international,
        created_at: moment(document.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(document.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: DocumentRemoved })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  async remove(@Request() req: any, @Param('id') id: number, @Res() res: any) {
    const { userId } = req;

    try {
      await this.documentService.remove(userId, id);

      return res.status(HttpStatus.OK).json({
        message: 'Document removed successfully',
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }
}
