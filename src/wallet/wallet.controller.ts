import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AccountType } from '../enums/AccountType';
import { AccountsService } from '../account/accounts.service';
import { CurrenciesService } from '../currency/currencies.service';
import { AccountDto } from '../dto/account.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('wallet')
@ApiTags('wallet page')
export class WalletController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly currenciesService: CurrenciesService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/')
  @Render('wallet')
  async getAccounts(@Req() req) {
    const userId = req.user.id;
    const viewData = {};
    viewData['currencies'] = await this.currenciesService.findAll();
    viewData['accountTypes'] = [
      AccountType.CURRENT,
      AccountType.CREDIT,
      AccountType.CASH,
      AccountType.SAVINGS,
    ];
    const accounts = (await this.accountsService.findAllByUserId(userId)) ?? [];

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
  async create(@Body() body, @Req() req, @Res() response) {
    const accountDto = new AccountDto();
    accountDto.title = body.name;
    accountDto.currency = body.currency;
    accountDto.accountType = body.accountType;
    accountDto.userId = req.user.id;

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

    await this.accountsService.update(accountDto);

    return response.redirect('/wallet');
  }

  @Delete('/account/delete')
  async delete(@Body('id') id: number, @Res() res) {
    await this.accountsService.delete(id);
    return res.status(HttpStatus.OK).send();
  }
}
