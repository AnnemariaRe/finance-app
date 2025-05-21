import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Render,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '../enums/AccountType';
import AccountsService from '../account/accounts.service';
import { CurrenciesService } from '../currency/currencies.service';
import { AccountDto } from '../dto/account.dto';

@Controller('wallet')
@ApiTags('wallet page')
export class WalletController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  @Get('/')
  @Render('wallet')
  async getAccounts() {
    const viewData = {};
    viewData['currencies'] = await this.currenciesService.findAll();
    viewData['accountTypes'] = [
      AccountType.CURRENT,
      AccountType.CREDIT,
      AccountType.CASH,
      AccountType.SAVINGS,
    ];
    const accounts = (await this.accountsService.findAllByUserId(1)) ?? [];

    const accountsWithTotalAmount = accounts.map((account) => {
      const totalAmount = 0;
      // TODO: calculate totalAmount by existing transactions
      return { ...account, totalAmount };
    });
    viewData['accounts'] = accountsWithTotalAmount;

    return { viewData };
  }

  @Get('/id')
  async getAccountById(id: number) {
    return { viewData: await this.accountsService.findById(id) };
  }

  @Post('/account')
  async create(@Body() body, @Res() response) {
    const accountDto = new AccountDto();
    accountDto.title = body.name;
    accountDto.currency = body.currency;
    accountDto.accountType = body.accountType;
    accountDto.userId = 1; // TODO: get userId from session

    await this.accountsService.create(accountDto);

    return response.redirect('/wallet');
  }

  @Post('/account/edit')
  async update(@Body() body, @Res() response) {
    const accountDto = new AccountDto();
    accountDto.id = body.id;
    accountDto.title = body.name;
    accountDto.currency = body.currency;
    accountDto.accountType = body.accountType;
    accountDto.isActive = body.isActive === 'on';
    accountDto.userId = 1; // TODO: get userId from session

    await this.accountsService.update(accountDto);

    return response.redirect('/wallet');
  }

  @Delete('/account/delete')
  async delete(@Body('id') id: number, @Res() res) {
    await this.accountsService.delete(id);
    return res.status(HttpStatus.OK).send();
  }
}
