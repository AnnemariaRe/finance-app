import { User } from '../entities/user.entity';
import { AccountType } from '../enums/AccountType';
import type { Account } from '../entities/account.entity';
import type { Currency } from '../entities/currency.entity';
import { Category } from '../entities/category.entity';
import { OperationType } from '../enums/OperationType';
import type { Transaction } from '../entities/transaction.entity';

export const fakeDate = new Date();

export const fakeUser: User = {
  id: 111,
  createdAt: fakeDate,
  updatedAt: fakeDate,
  email: 'email@gmail.com',
  name: 'name',
  password: 'hashed-password',
};

export const fakeCurrency: Currency = {
  id: 222,
  createdAt: fakeDate,
  name: 'Российский Рубль',
  code: 'RUB',
  symbol: '₽',
};

export const fakeAccount: Account = {
  id: 222,
  createdAt: fakeDate,
  updatedAt: fakeDate,
  title: 'title',
  isActive: true,
  accountType: AccountType.CURRENT,
  user: fakeUser,
  currency: fakeCurrency,
};

export const fakeCategory: Category = {
  id: 333,
  createdAt: fakeDate,
  name: 'Зарплата',
  operationType: OperationType.INCOME,
  user: fakeUser,
};

export const fakeTransaction: Transaction = {
  id: 444,
  createdAt: fakeDate,
  amount: 1000,
  date: fakeDate,
  account: fakeAccount,
  category: fakeCategory,
};
