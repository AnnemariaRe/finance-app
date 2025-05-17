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
import { Account } from './entities/account.entity';
import { Currency } from './entities/currency.entity';
import { Category } from './entities/category.entity';
import { Transaction } from './entities/transaction.entity';
import { WalletModule } from './wallet/wallet.module';
import { HistoryModule } from './history/history.module';

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
    WalletModule,
	HistoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgres://user:pg_password@db/postgres_db',
      entities: [User, Account, Currency, Category, Transaction]
    }),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
