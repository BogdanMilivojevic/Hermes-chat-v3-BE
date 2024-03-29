import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';
import * as jwt from 'jsonwebtoken';

describe('User update test (e2e)', () => {
  let app: INestApplication;
  let userToken;
  let user;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const username = 'peter';
    const email = 'peter@test.com';
    const password = '123456z';

    user = await User.create({ username, email, password });

    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });
  });

  it('should return 200 if the user updates his credentials', () => {
    return request(app.getHttpServer())
      .patch('/users/me')
      .send({
        email: 'peter@test.com',
        name: 'peteeeer',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('should return 200 if the user updates his credentials', async () => {
    const res = await request(app.getHttpServer())
      .patch('/users/password/me')
      .send({
        newPassword: '123456zzz',
        originalPassword: '123456z',
      })
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it('should return 401 if the user tries to update his credentials without token', () => {
    return request(app.getHttpServer())
      .patch('/users/me')
      .send({
        email: 'peter@test.com',
      })
      .expect(401);
  });

  it('should return 200 if the user does search successfully', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/search')
      .query({ username: 'peter' })
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.statusCode).toEqual(200);
  });

  it('should return 400 if the user performs search without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/users/search')
      .query({ username: 'peter' });

    expect(res.statusCode).toEqual(401);
  });
});
