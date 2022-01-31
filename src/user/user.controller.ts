import { UserRemoved } from './dto/user-removed.dto';
import { UserDto } from './dto/user.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/login/configs/jwt-auth.guard';

@ApiTags('User')
@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse()
  @ApiBearerAuth('JWT')
  findOne(@Request() req: any): Promise<UserDto> {
    const { userId } = req;

    return this.userService.findOne(userId);
  }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiBody({ type: CreateUserDto })
  create(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.userService.create(body);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDto })
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse()
  @ApiBearerAuth('JWT')
  update(@Request() req: any, @Body() body: UpdateUserDto): Promise<UserDto> {
    const { userId } = req;

    return this.userService.update(userId, body);
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
