import * as moment from 'moment';

import { UserDto } from './dto/user.dto';
import { UserRemoved } from './dto/user-removed.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UserService } from './user.service';

import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/configs/jwt-auth.guard';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  @ApiBearerAuth('JWT')
  async findOne(@Request() req: any, @Res() res: any): Promise<UserDto> {
    const { userId } = req;

    const user = await this.userService.findOne(userId);

    const documents: any[] = [];

    if (user.documents) {
      user.documents.forEach((document) => {
        documents.push({
          ...document,
          document_id: Number(document.document_id),
          user_id: Number(document.user_id),
          international: !!document.international,
          created_at: moment(document.created_at).format('YYYY-MM-DD HH:mm:ss'),
          updated_at: moment(document.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        });
      });
    }

    const obj = {
      ...user,
      user_id: Number(user.user_id),
      created_at: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss'),
    };

    if (documents.length) {
      obj.documents = documents;
    }

    return res.status(HttpStatus.OK).json(obj);
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiBody({ type: CreateUserDto })
  async create(@Body() body: CreateUserDto, @Res() res: any): Promise<UserDto> {
    try {
      const user = await this.userService.create(body);

      return res.status(HttpStatus.OK).json({
        ...user,
        user_id: Number(user.user_id),
        created_at: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    } catch (e) {
      console.log(e);
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  async update(
    @Request() req: any,
    @Res() res: any,
    @Body() body: UpdateUserDto,
  ): Promise<UserDto> {
    const { userId } = req;

    try {
      const user = await this.userService.update(userId, body);

      return res.status(HttpStatus.OK).json({
        ...user,
        user_id: Number(user.user_id),
        created_at: moment(user.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(user.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      });
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: `${e}`,
      });
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: UserRemoved })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  async remove(@Request() req: any) {
    const { userId } = req;

    await this.userService.remove(userId);

    return {
      message: 'User removed successfully',
    };
  }
}
