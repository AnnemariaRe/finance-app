import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { CreateAccountDto } from '../dto/create-account.dto';
import { Currency } from '../entities/currency.entity';
import { AccountType } from '../enums/AccountType';
import { User } from '../entities/user.entity';

@Injectable()
export default class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(createAccountDto: CreateAccountDto) {
    const { title, accountType, currency } = createAccountDto;
    const user = await this.userRepository.findOne({ where: { id: 1 } });
    const currencyEntity = await this.currencyRepository.findOne({
      where: { name: currency },
    });

    const account = new Account();
    account.user = user;
    account.currency = currencyEntity;
    account.title = title;

    let accountTypeEnum: AccountType;
    switch (accountType) {
      case 'Основной':
        accountTypeEnum = AccountType.CURRENT;
        break;
      case 'Сберегательный':
        accountTypeEnum = AccountType.SAVINGS;
        break;
      case 'Кредитный':
        accountTypeEnum = AccountType.CREDIT;
        break;
      case 'Наличные':
        accountTypeEnum = AccountType.CASH;
        break;
      default:
        throw new Error('Incorrect account type');
    }
    account.accountType = accountTypeEnum;

    await this.accountRepository.save(account);
    return account;
  }

  async findById(id: number) {
    const user = await this.accountRepository.findOne({ where: { id: id } });
    return user;
  }

  async findAll() {
    const account = await this.accountRepository.find();
    return account;
  }

  async findAllActiveByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accounts'],
    });
    return user.accounts;
  }

  async findAllByUserId(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['accounts.currency'],
    });
    if (user && user.accounts != null) return user.accounts;
  }
}
