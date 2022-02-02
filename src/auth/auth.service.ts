import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';

import { UserService } from '../user/user.service';

import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async userValidate(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const { user_id, name, email, created_at, updated_at } = user;

      const userDto = {
        user_id,
        name,
        email,
        created_at: moment(created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(updated_at).format('YYYY-MM-DD HH:mm:ss'),
      };

      await this.redis.set(`user_id_${user_id}`, JSON.stringify(userDto));

      return userDto;
    }

    return null;
  }

  async login(user: UserDto) {
    const payload = { email: user.email, sub: user.user_id };

    return {
      user,
      access_token: this.jwtService.sign(payload),
    };
  }
}
