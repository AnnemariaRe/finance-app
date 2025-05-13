import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DemoController } from './demo/demo.controller';
import { DemoService } from './demo/demo.service';
import { User } from './entities/user.entity';
import { UsersModule } from './users/users.module';
import { ResponseTimeInterceptor } from './response-time.interceptor';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { AppLoggerService } from './logger/app-logger.service';

@Module({
  controllers: [DemoController],
  providers: [
    DemoService,
    AppLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    },
  ],
  imports: [
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://user:pg_password@db/postgres_db',
      entities: [User],
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
