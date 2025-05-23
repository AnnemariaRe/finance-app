import { Test } from '@nestjs/testing';
import { TransactionsService } from '../transactions/transactions.service';
import { HistoryController } from './history.controller';
import axios from 'axios';
import {
  fakeAccount,
  fakeCurrency,
  fakeTransaction,
  fakeUser,
} from '../util/fakers';
import { mockRequest } from '../util/mocks';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('HistoryController', () => {
  let historyController: HistoryController;
  let transactionsService: TransactionsService;
  const logger = { error: jest.fn(), log: jest.fn(), warn: jest.fn() };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HistoryController],
    })
      .useMocker((token) => {
        if (token === TransactionsService) {
          return {
            findAllTransactionsByUserId: jest
              .fn()
              .mockResolvedValue(Promise.resolve([])),
          };
        }
      })
      .compile();
    moduleRef.useLogger(logger);

    transactionsService = moduleRef.get(TransactionsService);
    historyController = moduleRef.get(HistoryController);
  });

  describe('getTransactions', () => {
    it('should work without transactions', async () => {
      const req = mockRequest();
      const result = await historyController.getTransactions(req);
      expect(result).toEqual({ viewData: { transactions: [] } });
      expect(
        transactionsService.findAllTransactionsByUserId,
      ).toHaveBeenCalledWith(fakeUser.id);
    });

    it('fetches exchange rate for non-ruble currencies', async () => {
      const transaction = {
        ...fakeTransaction,
        account: {
          ...fakeAccount,
          currency: {
            ...fakeCurrency,
            code: 'USD',
          },
        },
      };
      jest
        .spyOn(transactionsService, 'findAllTransactionsByUserId')
        .mockResolvedValue([transaction]);
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          data: {
            RUB: { value: 100 },
          },
        },
        status: 200,
        statusText: 'Ok',
        headers: {},
        config: {},
      });
      const req = mockRequest();

      const result = await historyController.getTransactions(req);
      expect(result).toEqual({
        viewData: {
          expenseLength: 0,
          expense_xValues: [],
          expense_yValues: [],
          incomeLength: 1,
          income_xValues: ['Зарплата'],
          income_yValues: [100_000],
          transactions: [
            {
              ...transaction,
              date: transaction.date.toISOString().split('T')[0],
            },
          ],
        },
      });
      expect(
        transactionsService.findAllTransactionsByUserId,
      ).toHaveBeenCalledWith(fakeUser.id);
    });
  });

  it('adds amount if exchange rate fetch fails', async () => {
    const transaction = {
      ...fakeTransaction,
      account: {
        ...fakeAccount,
        currency: {
          ...fakeCurrency,
          code: 'USD',
        },
      },
    };
    const error = new Error('something went wrong');
    jest
      .spyOn(transactionsService, 'findAllTransactionsByUserId')
      .mockResolvedValue([transaction]);
    mockedAxios.get.mockImplementation(() => {
      throw error;
    });
    const req = mockRequest();

    const result = await historyController.getTransactions(req);

    expect(logger.error).toHaveBeenCalledWith(
      'Currency conversion failed:',
      error,
      'HistoryController',
    );
    expect(result).toEqual({
      viewData: {
        expenseLength: 0,
        expense_xValues: [],
        expense_yValues: [],
        incomeLength: 1,
        income_xValues: ['Зарплата'],
        income_yValues: [1000],
        transactions: [
          {
            ...transaction,
            date: transaction.date.toISOString().split('T')[0],
          },
        ],
      },
    });
    expect(
      transactionsService.findAllTransactionsByUserId,
    ).toHaveBeenCalledWith(fakeUser.id);
  });
});
