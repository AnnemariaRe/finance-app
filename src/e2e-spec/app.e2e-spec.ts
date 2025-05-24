import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import { DemoModule } from '../demo/demo.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../global-exception.filter';
import { UnauthorizedExceptionFilter } from '../unauthorized-exception.filter';
import axios from 'axios';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';
import {
  fakeAccount,
  fakeCategory,
  fakeCurrency,
  fakeTransaction,
  fakeUser,
} from '../util/fakers';
import { Transaction } from '../entities/transaction.entity';
import { Account } from '../entities/account.entity';
import { Category } from '../entities/category.entity';
import { UsersController } from '../users/users.controller';
import { AuthController } from '../auth/auth.controller';
import { AuthService } from '../auth/auth.service';
import { IndexController } from '../index/index.controller';
import { AccountsService } from '../account/accounts.service';
import { CategoriesService } from '../categories/categories.service';
import { TransactionsService } from '../transactions/transactions.service';
import { WalletController } from '../wallet/wallet.controller';
import { CurrenciesService } from '../currency/currencies.service';
import { HistoryController } from '../history/history.controller';
import { mockLogger } from '../util/mocks';
import { CategoriesController } from '../categories/categories.controller';
import { Currency } from '../entities/currency.entity';
import { PassportModule } from '@nestjs/passport';
import session from 'express-session';
import passport from 'passport';
import bcrypt from 'bcrypt';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const bcryptCompare = jest.fn().mockResolvedValue(true);
(bcrypt.compare as jest.Mock) = bcryptCompare;
(bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue('hashed-password');

describe('End to end tests', () => {
  let app: NestExpressApplication;
  const logger = mockLogger();

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [
        UsersController,
        AuthController,
        IndexController,
        WalletController,
        HistoryController,
        CategoriesController,
      ],
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        CacheModule.register({ ttl: 3600_000, isGlobal: true }),
        PassportModule.register({ session: true }),
        DemoModule,
      ],
      providers: [
        UsersService,
        AuthService,
        AccountsService,
        CategoriesService,
        TransactionsService,
        CurrenciesService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn().mockResolvedValue(fakeUser),
            findOneBy: jest.fn().mockResolvedValue(fakeUser),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: {
            save: jest.fn(),
            find: jest.fn().mockResolvedValue([fakeTransaction]),
          },
        },
        {
          provide: getRepositoryToken(Account),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeAccount) },
        },
        {
          provide: getRepositoryToken(Category),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeCategory) },
        },
        {
          provide: getRepositoryToken(Currency),
          useValue: { findOne: jest.fn().mockResolvedValue(fakeCurrency) },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useLogger(logger);
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(
      new GlobalExceptionFilter(),
      new UnauthorizedExceptionFilter(),
    );
    hbs.registerHelper('startsWith', function (str, prefix) {
      return str.startsWith(prefix);
    });

    app.use(
      session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false },
      }),
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
      res.locals.currentPath = req.path;
      next();
    });
    app.useStaticAssets(join(__dirname, '..', '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
    app.setViewEngine('hbs');
    hbs.registerPartials(join(__dirname, '..', '..', 'views', 'partials'));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /demo/hello renders demo page', () => {
    return request(app.getHttpServer())
      .get('/demo/hello')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });

  test('GET /demo/error renders error page', () => {
    return request(app.getHttpServer())
      .get('/demo/error')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });

  test('GET /auth/login renders', () => {
    return request(app.getHttpServer())
      .get('/auth/login')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });

  test('GET /auth/register renders', () => {
    return request(app.getHttpServer())
      .get('/auth/register')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });

  test('GET / redirect to login when unauthorized', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect((res) => {
        expect(res.headers['location']).toEqual('/auth/login');
      });
  });

  test('GET /history redirect to login when unauthorized', () => {
    return request(app.getHttpServer())
      .get('/history')
      .expect(302)
      .expect((res) => {
        expect(res.headers['location']).toEqual('/auth/login');
      });
  });

  test('GET /wallet redirect to login when unauthorized', () => {
    return request(app.getHttpServer())
      .get('/wallet')
      .expect(302)
      .expect((res) => {
        expect(res.headers['location']).toEqual('/auth/login');
      });
  });

  test('GET /categories redirect to login when unauthorized', () => {
    return request(app.getHttpServer())
      .get('/categories')
      .expect(302)
      .expect((res) => {
        expect(res.headers['location']).toEqual('/auth/login');
      });
  });
});
