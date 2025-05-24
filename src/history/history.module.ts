import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { Transaction } from '../entities/transaction.entity';
import { HistoryController } from './history.controller';
import { TransactionsService } from '../transactions/transactions.service';
import { AppLoggerService } from '../logger/app-logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Category, User])],
  controllers: [HistoryController],
  providers: [TransactionsService, AppLoggerService],
})
export class HistoryModule {}
