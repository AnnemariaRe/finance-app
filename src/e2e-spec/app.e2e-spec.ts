import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { DemoModule } from '../demo/demo.module';

describe('End to end tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [DemoModule],
    }).compile();

    app = moduleFixture.createNestApplication({ logger: false });
    await app.init();
  });

  test('GET /hello', () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect(({ body }) => {
        expect(body.message).toEqual('Hello World!');
      });
  });

  test('GET /error', () => {
    return request(app.getHttpServer())
      .get('/error')
      .expect(500)
      .expect(({ body }) => {
        expect(body.message).toEqual('Internal server error');
      });
  });
});
