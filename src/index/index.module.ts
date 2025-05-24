import { Module } from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';
import { User } from '../entities/user.entity';
import { IndexController } from './index.controller';
import { Currency } from '../entities/currency.entity';
import { AccountsService } from '../account/accounts.service';
import { TransactionsService } from '../transactions/transactions.service';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account, Category, User, Currency]),
  ],
  controllers: [IndexController],
  providers: [AccountsService, CategoriesService, TransactionsService],
})
export class IndexModule {}
