import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorsMiddleware } from '@nest-middlewares/cors';
import { MiddlewareConsumer, Module } from '@nestjs/common';

import { Helper } from './helper';
import { AuthModule } from './auth/auth.module';
import { Middleware } from './middleware';
import { UserModule } from './user/user.module';
import { DocumentModule } from './document/document.module';
import { AuthController } from './auth/auth.controller';
import { UserController } from './user/user.controller';
import { DocumentController } from './document/document.controller';
import { AuthService } from './auth/auth.service';
import { UserService } from './user/user.service';
import { DocumentService } from './document/document.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['**/entities/*.entity.js'],
      synchronize: false,
      migrations: ['database/migrations/*.js'],
      cli: {
        migrationsDir: 'database/migrations',
      },
    }),
    RedisModule.forRoot({
      config: {
        url: `redis://:@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      },
    }),
    UserModule,
    AuthModule,
    DocumentModule,
  ],
  providers: [Helper, AuthService, UserService, DocumentService],
  controllers: [AuthController, UserController, DocumentController],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, Middleware).forRoutes('api/*');
  }
}
