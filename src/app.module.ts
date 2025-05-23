import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { ResponseTimeInterceptor } from './response-time.interceptor';
import { RequestLoggerMiddleware } from './logger/request-logger.middleware';
import { AppLoggerService } from './logger/app-logger.service';
import { WalletModule } from './wallet/wallet.module';
import { HistoryModule } from './history/history.module';
import { DemoModule } from './demo/demo.module';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { IndexModule } from './index/index.module';

const ONE_HOUR_IN_MS = 1000 * 60 * 60;

@Module({
  providers: [
    AppLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTimeInterceptor,
    },
  ],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.register({ ttl: ONE_HOUR_IN_MS, isGlobal: true }),
    DemoModule,
    UsersModule,
    IndexModule,
    WalletModule,
    HistoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DB_URL,
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
