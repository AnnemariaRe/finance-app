import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { HistoryController } from './history.controller';
import TransactionsService from 'src/transactions/transactions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Account, Category, User])],
  controllers: [HistoryController],
  providers: [TransactionsService]
})
export class HistoryModule {}
