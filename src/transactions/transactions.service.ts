import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';
import { OperationType } from '../enums/OperationType';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const { amount, date, account, category } = createTransactionDto;
    const _account = await this.accountRepository.findOne({
      where: { user: { id: userId }, title: account },
    });
    const _category = await this.categoryRepository.findOne({
      where: { user: { id: userId }, name: category },
    });

    const transaction = new Transaction();
    if (_category.operationType == OperationType.EXPENSE) {
      transaction.amount = -amount;
    } else {
      transaction.amount = amount;
    }

    transaction.category = _category;
    transaction.date = date;
    transaction.account = _account;

    await this.transactionRepository.save(transaction);
    return transaction;
  }

  async findAllTransactionsByUserId(userId: number) {
    return await this.transactionRepository.find({
      relations: { account: { user: true, currency: true }, category: true },
      where: { account: { user: { id: userId } } },
    });
  }
}
