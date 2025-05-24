import { Test } from '@nestjs/testing';
import { fakeAccount, fakeUser } from '../util/fakers';
import { AccountsService } from '../account/accounts.service';
import { CurrenciesService } from '../currency/currencies.service';
import { WalletController } from './wallet.controller';
import { HttpStatus } from '@nestjs/common';
import { mockResponse } from '../util/mocks';

describe('WalletController', () => {
  let walletController: WalletController;
  let accountsService: AccountsService;
  let currenciesService: CurrenciesService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [WalletController],
    })
      .useMocker((token) => {
        if (token === AccountsService) {
          return {
            delete: jest.fn(),
            update: jest.fn(),
            findOne: jest.fn().mockResolvedValue(fakeUser),
          };
        }
        if (token === CurrenciesService) {
          return {
            create: jest.fn(),
            findOne: jest.fn().mockResolvedValue(fakeUser),
          };
        }
      })
      .compile();

    accountsService = moduleRef.get(AccountsService);
    currenciesService = moduleRef.get(CurrenciesService);
    walletController = moduleRef.get(WalletController);
  });

  // TODO: test other methods

  describe('update', () => {
    it('should call update in service"', async () => {
      const body = {
        id: fakeAccount.id,
        name: fakeAccount.title,
        accountType: fakeAccount.accountType,
        currency: fakeAccount.currency.name,
        isActive: 'on',
      };
      const res = mockResponse();

      await walletController.update(body, res);

      const dto = {
        id: fakeAccount.id,
        title: fakeAccount.title,
        accountType: fakeAccount.accountType,
        currency: fakeAccount.currency.name,
        isActive: fakeAccount.isActive,
      };
      expect(accountsService.update).toHaveBeenCalledWith(dto);
      expect(res.redirect).toHaveBeenCalledWith('/wallet');
    });
  });

  describe('delete', () => {
    it('should call delete in service"', async () => {
      const res = mockResponse();

      await walletController.delete(fakeAccount.id, res);

      expect(accountsService.delete).toHaveBeenCalledWith(fakeAccount.id);
      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.send).toHaveBeenCalled();
    });
  });
});
