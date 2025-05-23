import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';
import { AccountDto } from '../dto/account.dto';
import { Currency } from '../entities/currency.entity';
import { AccountType } from '../enums/AccountType';
import { User } from '../entities/user.entity';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Currency)
    private readonly currencyRepository: Repository<Currency>,
  ) {}

  async create(accountDto: AccountDto) {
    const { title, accountType, currency, userId } = accountDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const currencyEntity = await this.currencyRepository.findOne({
      where: { name: currency },
    });
    const accountTypeEnum = this.mapAccountType(accountType);

    const account = new Account();
    account.title = title;
    account.currency = currencyEntity;
    account.accountType = accountTypeEnum;
    account.user = user;
    account.isActive = true;

    return this.accountRepository.save(account);
  }

  async update(accountDto: AccountDto) {
    const { id, title, accountType, currency, isActive } = accountDto;

    const currencyEntity = await this.currencyRepository.findOne({
      where: { name: currency },
    });
    const accountTypeEnum = this.mapAccountType(accountType);

    const account = await this.accountRepository.findOne({ where: { id } });
    account.title = title;
    account.currency = currencyEntity;
    account.accountType = accountTypeEnum;
    account.isActive = isActive;

    return this.accountRepository.save(account);
  }

  async findById(id: number) {
    return await this.accountRepository.findOne({ where: { id: id } });
  }

  async findAll() {
    return await this.accountRepository.find();
  }

  async findAllActiveByUserId(userId: number) {
    return await this.accountRepository.find({
      relations: { user: true },
      where: { user: { id: userId }, isActive: true },
    });
  }

  async findAllByUserId(userId: number) {
    return await this.accountRepository.find({
      relations: { user: true, currency: true },
      where: { user: { id: userId } },
      order: { createdAt: 1 },
    });
  }

  async delete(id: number) {
    await this.accountRepository.delete(id);
  }

  private mapAccountType(accountType: string): AccountType {
    switch (accountType) {
      case 'Основной':
        return AccountType.CURRENT;
      case 'Сберегательный':
        return AccountType.SAVINGS;
      case 'Кредитный':
        return AccountType.CREDIT;
      case 'Наличные':
        return AccountType.CASH;
      default:
        throw new Error(`Unsupported account type: ${accountType}`);
    }
  }
}
