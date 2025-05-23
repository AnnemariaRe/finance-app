import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import hbs from 'hbs';
import { DemoModule } from '../demo/demo.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from '../global-exception.filter';

describe('End to end tests', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DemoModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useStaticAssets(join(__dirname, '..', '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', '..', 'views'));
    app.setViewEngine('hbs');
    hbs.registerPartials(join(__dirname, '..', '..', 'views', 'partials'));

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('GET /hello renders demo page', () => {
    return request(app.getHttpServer())
      .get('/demo/hello')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });

  test('GET /error renders error page', () => {
    return request(app.getHttpServer())
      .get('/demo/error')
      .expect(200)
      .expect((res) => {
        expect(res.text).toMatchSnapshot();
      });
  });
});
