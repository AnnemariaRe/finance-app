import { Module } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Category } from 'src/entities/category.entity';
import { User } from 'src/entities/user.entity';
import { IndexController } from './index.controller';
import { Currency } from 'src/entities/currency.entity';
import AccountsService from '../account/accounts.service';
import CategoriesService from '../categories/catigories.service';
import TransactionsService from '../transactions/transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account, Category, User, Currency]),
  ],
  controllers: [IndexController],
  providers: [AccountsService, CategoriesService, TransactionsService],
})
export class IndexModule {}
