import {
  Body,
  Controller,
  Get,
  Post,
  Render,
  Res,
  UseFilters,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '../enums/AccountType';
import AccountsService from '../account/accounts.service';
import { CurrenciesService } from '../currency/currencies.service';
import { CreateAccountDto } from '../dto/create-account.dto';
import { GlobalExceptionFilter } from 'src/global-exception.filter';

@Controller('wallet')
@ApiTags('wallet page')
export class WalletController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  @Get('/')
  @UseFilters(new GlobalExceptionFilter())
  @Render('wallet')
  async getAccounts() {
    const viewData = [];
    viewData['currencies'] = await this.currenciesService.findAll();
    viewData['accountTypes'] = [
      AccountType.CURRENT,
      AccountType.CREDIT,
      AccountType.CASH,
      AccountType.SAVINGS
    ];
    const accounts = (await this.accountsService.findAllByUserId(1)) ?? [];

    const accountsWithTotalAmount = accounts.map((account) => {
      const totalAmount = 0;
      // TODO: calculate totalAmount by existing transactions
      return { ...account, totalAmount };
    });
    viewData['accounts'] = accountsWithTotalAmount;

    return { viewData: viewData };
  }

  @Get('/id')
  @UseFilters(new GlobalExceptionFilter())
  @Render('wallet')
  async getAccountById(id: number) {
    return { viewData: await this.accountsService.findById(id) };
  }

  @Post('/account')
  @UseFilters(new GlobalExceptionFilter())
  async create(@Body() body, @Res() response) {
    const accountDto = new CreateAccountDto();
    accountDto.title = body.name;
    accountDto.currency = body.currency;
    accountDto.accountType = body.accountType;

    await this.accountsService.create(accountDto);

    return response.redirect('/wallet');
  }
}
