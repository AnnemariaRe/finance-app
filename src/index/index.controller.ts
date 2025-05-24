import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Render,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ApiTags } from '@nestjs/swagger';
import { OperationType } from '../enums/OperationType';
import { AccountType } from '../enums/AccountType';
import axios from 'axios';
import { AccountsService } from '../account/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import * as process from 'node:process';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthGuard } from '../auth/auth.guard';

@Controller('')
@ApiTags('index page')
export class IndexController {
  constructor(
    private readonly accountsService: AccountsService,
    private readonly categoriesService: CategoriesService,
    private readonly transactionsService: TransactionsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post('/transaction')
  async create(@Body() body, @Req() req, @Res() response) {
    const transactionDto = new CreateTransactionDto();
    transactionDto.amount = body.amount;
    transactionDto.date = new Date(body.date as string);
    transactionDto.account = body.account;
    transactionDto.category = body.category;

    await this.transactionsService.create(req.user.id, transactionDto);

    return response.redirect('/');
  }

  @UseGuards(AuthGuard)
  @Get('/')
  @Render('index')
  async getTransactions(@Req() req) {
    const userId = req.user.id;
    const viewData = {};
    viewData['accounts'] = await this.accountsService.findAllActiveByUserId(
      userId,
    );
    const categories = await this.categoriesService.findCategoriesByUserId(
      userId,
    );
    viewData['expenseCategories'] = categories.filter(
      (category) => category.operationType === OperationType.EXPENSE,
    );
    viewData['incomeCategories'] = categories.filter(
      (category) => category.operationType === OperationType.INCOME,
    );
    const transactions =
      await this.transactionsService.findAllTransactionsByUserId(userId);
    viewData['transactions'] = transactions.map((transaction) => {
      return {
        id: transaction.id,
        createdAt: transaction.createdAt,
        amount: transaction.amount,
        date: transaction.date.toISOString().split('T')[0],
        account: transaction.account,
        category: transaction.category,
      };
    });

    let amountInRUB = 0;
    let totalAmount = 0;
    let totalSavings = 0;
    let monthExpense = 0;
    let monthIncome = 0;
    const now = new Date();

    const data = Array(31).fill(0);
    const xValues = [];

    const today = Number(String(now.getDate()).padStart(2, '0'));
    const month = now.getMonth();

    let start: number;
    let start2: number;
    if (today > 10) {
      start = today - 9;
      start2 = today - 9;
    } else {
      start = 1;
      start2 = 1;
    }

    for (let i = 0; i < 10; i++) {
      xValues[i] = start;
      start++;
    }

    for (const transaction of transactions) {
      const currency = transaction.account.currency.code;

      if (currency != 'RUB') {
        const exchangeRate = await this.fetchExchangeRate(currency);
        amountInRUB = transaction.amount * exchangeRate;

        totalAmount += amountInRUB;
      } else {
        amountInRUB = transaction.amount;
        totalAmount += Number(amountInRUB);
      }

      if (transaction.account.accountType == AccountType.SAVINGS) {
        totalSavings += Number(amountInRUB);
      }

      if (transaction.date.getMonth() == month) {
        if (transaction.category.operationType == OperationType.EXPENSE) {
          monthExpense += Number(-amountInRUB);

          const day = transaction.date.getDate();
          if (transaction.date.getMonth() == month && day > today - 9) {
            data[day] += Number(-transaction.amount);
          }
        } else {
          monthIncome += Number(amountInRUB);
        }
      }
    }
    viewData['totalAmount'] = totalAmount.toFixed(2);
    viewData['totalSavings'] = totalSavings.toFixed(2);
    viewData['availableNow'] = (totalAmount - totalSavings).toFixed(2);
    viewData['monthExpense'] = monthExpense.toFixed(2);
    viewData['monthIncome'] = monthIncome.toFixed(2);

    viewData['dayValues'] = xValues;
    viewData['chartData'] = data.slice(start2, start2 + 10);

    return { viewData: viewData, showLoginButton: true };
  }

  async fetchExchangeRate(currencyCode: string) {
    const cacheKey = `exchange-${currencyCode}`;
    let result = await this.cacheManager.get<number>(cacheKey);
    if (!result) {
      const apiKey = process.env.CURRENCY_API_KEY;
      const response = await axios.get(
        `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=RUB&base_currency=${currencyCode}`,
      );
      result = response.data.data['RUB'].value;
      await this.cacheManager.set(cacheKey, result);
    }
    return result;
  }
}
