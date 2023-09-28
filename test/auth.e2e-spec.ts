import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';

describe('Login and register test (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const username = 'john';
    const email = 'john@test.com';
    const password = '123456z';

    await User.create({ username, email, password });
  });

  afterAll(async () => {
    await User.destroy({
      truncate: true,
      cascade: true,
    });
  });

  it('should return 201 if user has logged in', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@test.com',
        password: '123456z',
      })
      .expect(201);
  });

  it('should return error if password is incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@test.com',
        password: '123456zz',
      })
      .expect(401);
  });

  it('should return error if email is incorrect', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john2@test.com',
        password: '123456z',
      })
      .expect(401);
  });

  it('should return 201 if user has registered', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'bogdan',
        email: 'bogdan@test.com',
        password: '123456z',
      })
      .expect(201);
  });

  it('should return 422 if user already exists', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: 'bogdan',
        email: 'bogdan@test.com',
        password: '123456z',
      });

    expect(response.body.status).toEqual(422);
  });

  it('should return 400 if some credentials are missing', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'bogdan1@test.com',
        password: '123456z',
      })
      .expect(400);
  });
});
