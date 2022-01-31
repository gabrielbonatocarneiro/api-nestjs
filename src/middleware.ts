import * as jwt from 'jsonwebtoken';
import { jwtConstants } from './login/configs/constants';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

@Injectable()
export class Middleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.baseUrl === '/api/user' && req.method === 'POST') {
      return next();
    }

    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
      const data = jwt.verify(token, jwtConstants.secret);

      const { sub } = data as TokenPayload;

      req.userId = BigInt(sub);

      return next();
    } catch (e) {
      return res.status(400).json({
        message: 'Bad request',
        error: `${e}`,
      });
    }
  }
}
