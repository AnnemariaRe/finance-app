import { Controller, Get, Logger, Render, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OperationType } from '../enums/OperationType';
import { TransactionsService } from '../transactions/transactions.service';
import axios from 'axios';
import { AuthGuard } from '../auth/auth.guard';

@Controller('history')
@ApiTags('history page')
export class HistoryController {
  constructor(private readonly transactionsService: TransactionsService) {}

  private readonly logger = new Logger(HistoryController.name);

  @UseGuards(AuthGuard)
  @Get('/')
  @Render('history')
  async getTransactions(@Req() req) {
    const userId = req.user.id;
    const viewData = {};
    const transactions =
      (await this.transactionsService.findAllTransactionsByUserId(userId)) ||
      [];
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

    if (transactions.length === 0) {
      return { viewData: viewData };
    }

    const expensesByCategory = {};
    const incomesByCategory = {};
    const apiKey = 'uB9jmOX6xlypRBtHq65elzi5AZAaUI27vSXSniFo';
    const now = new Date();

    for (const transaction of transactions) {
      if (!transaction.account?.currency?.code || !transaction.category) {
        continue; // skip invalid transactions
      }

      const currency = transaction.account.currency.code;
      let amountInRUB: number;

      try {
        if (currency != 'RUB') {
          const response = await axios.get(
            `https://api.currencyapi.com/v3/latest?apikey=${apiKey}&currencies=RUB&base_currency=${currency}`,
          );
          const exchangeRate = response.data.data['RUB'].value;
          amountInRUB = transaction.amount * exchangeRate;
        } else {
          amountInRUB = transaction.amount;
        }
      } catch (error) {
        this.logger.error('Currency conversion failed:', error);
        amountInRUB = transaction.amount;
      }

      if (transaction.date.getMonth() == now.getMonth()) {
        const category = transaction.category.name;
        if (transaction.category.operationType == OperationType.EXPENSE) {
          expensesByCategory[category] =
            (expensesByCategory[category] || 0) + Number(-amountInRUB);
        } else {
          incomesByCategory[category] =
            (incomesByCategory[category] || 0) + Number(amountInRUB);
        }
      }
    }

    viewData['expense_xValues'] = Object.keys(expensesByCategory);
    viewData['expense_yValues'] = Object.values(expensesByCategory);
    viewData['expenseLength'] = viewData['expense_yValues'].length;
    viewData['income_xValues'] = Object.keys(incomesByCategory);
    viewData['income_yValues'] = Object.values(incomesByCategory);
    viewData['incomeLength'] = viewData['income_yValues'].length;

    return { viewData: viewData };
  }
}
