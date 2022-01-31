import { UserNotAuthorized } from './dto/user-not-authorized';
import { UserLogged } from './dto/user-logged.dto';
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
import { LoginService } from './login.service';
import { LocalAuthGuard } from './configs/local-auth.guard';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  @UseGuards(LocalAuthGuard)
  @ApiOkResponse({ type: UserLogged, isArray: false })
  @ApiUnauthorizedResponse({ type: UserNotAuthorized })
  @ApiBody({ type: LoginDto })
  async login(@Request() req: any, @Res() res: any) {
    const login = await this.loginService.login(req.user);

    return res.status(HttpStatus.OK).json(login);
  }
}
