import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  fakeAccount,
  fakeCategory,
  fakeDate,
  fakeTransaction,
  fakeUser,
} from '../util/fakers';
import { TransactionsService } from './transactions.service';
import { type Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';
import type { CreateTransactionDto } from '../dto/create-transaction.dto';
import { OperationType } from '../enums/OperationType';

describe('TransactionsService', () => {
  let transactionsService: TransactionsService;
  let transactionRepository: Repository<Transaction>;
  let accountRepository: Repository<Account>;
  let categoryRepository: Repository<Category>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([fakeTransaction]),
          },
        },
        {
          provide: getRepositoryToken(Account),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeAccount) },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeCategory) },
        },
      ],
    }).compile();

    transactionRepository = moduleRef.get(getRepositoryToken(Transaction));
    accountRepository = moduleRef.get(getRepositoryToken(Account));
    categoryRepository = moduleRef.get(getRepositoryToken(Category));
    transactionsService = moduleRef.get(TransactionsService);
  });

  describe('create', () => {
    it('saves dto to db"', async () => {
      const dto: CreateTransactionDto = {
        amount: 1000,
        date: fakeDate,
        account: fakeAccount.title,
        category: fakeCategory.name,
      };

      await transactionsService.create(fakeUser.id, dto);

      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: fakeUser.id }, title: fakeAccount.title },
      });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: fakeUser.id }, name: fakeCategory.name },
      });
      expect(transactionRepository.save).toHaveBeenCalledWith({
        amount: 1000,
        date: fakeDate,
        account: fakeAccount,
        category: fakeCategory,
      } as Transaction);
    });

    it('inverts negative amount"', async () => {
      const category: Category = {
        ...fakeCategory,
        name: 'Продукты',
        operationType: OperationType.EXPENSE,
      };
      jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(category);
      const dto: CreateTransactionDto = {
        amount: 1000,
        date: fakeDate,
        account: fakeAccount.title,
        category: fakeCategory.name,
      };

      await transactionsService.create(fakeUser.id, dto);

      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: fakeUser.id }, title: fakeAccount.title },
      });
      expect(categoryRepository.findOne).toHaveBeenCalledWith({
        where: { user: { id: fakeUser.id }, name: fakeCategory.name },
      });
      expect(transactionRepository.save).toHaveBeenCalledWith({
        amount: -1000,
        date: fakeDate,
        account: fakeAccount,
        category: category,
      } as Transaction);
    });
  });

  describe('findAllTransactionsByUserId', () => {
    it('should get data from db"', async () => {
      const result = await transactionsService.findAllTransactionsByUserId(111);
      expect(result).toEqual([fakeTransaction]);
      expect(transactionRepository.find).toHaveBeenCalledWith({
        relations: { account: { user: true, currency: true }, category: true },
        where: { account: { user: { id: fakeUser.id } } },
      });
    });
  });
});
