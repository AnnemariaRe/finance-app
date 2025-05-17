import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from 'src/entities/account.entity';
import { Category } from 'src/entities/category.entity';
import { OperationType } from 'src/enums/OperationType';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { CreateTransactionDto } from 'src/dto/create-transaction.dto';

@Injectable()
export default class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createTransactionDto: CreateTransactionDto) {
    const { amount, date, account, category } = createTransactionDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const _account = await this.accountRepository.findOne({
      where: { user: user, title: account },
    });
    const _category = await this.categoryRepository.findOne({
      where: { user: user, name: category },
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
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'accounts.transactions.category',
        'accounts.transactions.account.currency',
      ],
    });
    if (user && user.accounts != null) {
      const transactions = user.accounts.reduce((acc, account) => {
        if (account.transactions != null) {
          acc.push(...account.transactions);
        }
        return acc;
      }, []);

      return transactions;
    }
  }
}
