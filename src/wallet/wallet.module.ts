import { Module } from '@nestjs/common';
import { Account } from '../entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Currency } from '../entities/currency.entity';
import { WalletController } from './wallet.controller';
import { AccountsService } from '../account/accounts.service';
import { CurrenciesService } from 'src/currency/currencies.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { Transaction } from 'src/entities/transaction.entity';
import { Category } from 'src/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Currency, Transaction, Category])],
  controllers: [WalletController],
  providers: [AccountsService, CurrenciesService, TransactionsService],
})
export class WalletModule {}
