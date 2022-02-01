import { UserDto } from '../user/dto/user.dto';
import { UserService } from '../user/user.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async userValidate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { user_id, name, email } = user;

      return { user_id, name, email };
    }

    return null;
  }

  async login(user: UserDto) {
    const payload = { email: user.email, sub: user.user_id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
