import { Module } from '@nestjs/common';
import { Account } from '../entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Currency } from '../entities/currency.entity';
import { WalletController } from './wallet.controller';
import { AccountsService } from '../account/accounts.service';
import { CurrenciesService } from 'src/currency/currencies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User, Currency])],
  controllers: [WalletController],
  providers: [AccountsService, CurrenciesService],
})
export class WalletModule {}
