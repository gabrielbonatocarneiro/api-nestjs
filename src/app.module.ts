import { AuthModule } from './auth/auth.module';
import { Middleware } from './middleware';
import { UserModule } from './user/user.module';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CorsMiddleware } from '@nest-middlewares/cors';
import { DocumentModule } from './document/document.module';

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
    UserModule,
    AuthModule,
    DocumentModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorsMiddleware, Middleware).forRoutes('api/*');
  }
}
