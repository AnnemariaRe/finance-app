import { User } from '../entities/user.entity';
import { AccountType } from '../enums/AccountType';
import type { Account } from '../entities/account.entity';
import type { Currency } from '../entities/currency.entity';

export const fakeUser: User = {
  id: 111,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: 'email@gmail.com',
  name: 'name',
  password: 'password',
};

export const fakeCurrency: Currency = {
  id: 222,
  createdAt: new Date(),
  name: 'Российский Рубль',
  code: 'RUB',
  symbol: '₽',
};

export const fakeAccount: Account = {
  id: 222,
  createdAt: new Date(),
  updatedAt: new Date(),
  title: 'title',
  isActive: true,
  accountType: AccountType.CURRENT,
  user: fakeUser,
  currency: fakeCurrency,
};
