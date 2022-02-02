import {
  Controller,
  Post,
  Request,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { LoginDto } from './dto/login.dto';
import { UserLogged } from './dto/user-logged.dto';
import { UserNotAuthorized } from './dto/user-not-authorized';

import { AuthService } from './auth.service';

import { LocalAuthGuard } from './configs/local-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: UserLogged, isArray: false })
  @ApiUnauthorizedResponse({ type: UserNotAuthorized })
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any, @Res() res: any) {
    const login = await this.authService.login(req.user);

    return res.status(HttpStatus.OK).json(login);
  }
}
