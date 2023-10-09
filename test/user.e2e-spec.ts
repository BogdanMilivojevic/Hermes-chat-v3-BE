import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { User } from 'src/users/user.entity';
import * as jwt from 'jsonwebtoken';

describe('Login and register test (e2e)', () => {
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

  //   afterEach(async () => {
  //     await User.destroy({
  //       where: {
  //         id: user.id,
  //       },
  //     });
  //   });

  it('should return 200 if the user updates his credentials', () => {
    return request(app.getHttpServer())
      .patch('/users/me')
      .send({
        email: 'peter@test.com',
        password: '123456z',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
  });

  it('should return 401 if the user tries to update his credentials without token', () => {
    return request(app.getHttpServer())
      .patch('/users/me')
      .send({
        email: 'peter@test.com',
        password: '123456z',
      })
      .expect(401);
  });
});
