import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as momentTz from 'moment-timezone';

import { Injectable } from '@nestjs/common';

const saltRounds = 10;

@Injectable()
export class Helper {
  async generateHash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedValue = await bcrypt.hash(value, salt);

    return hashedValue;
  }

  async valueIsEqualHash(value: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(value, hash);
  }

  now(): string {
    return momentTz
      .tz(moment.utc(moment()), 'America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss');
  }
}
