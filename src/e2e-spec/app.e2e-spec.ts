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

jest.mock('axios');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('End to end tests', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DemoModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(
      new GlobalExceptionFilter(),
      new UnauthorizedExceptionFilter(),
    );
    hbs.registerHelper('startsWith', function (str, prefix) {
      return str.startsWith(prefix);
    });

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
});
