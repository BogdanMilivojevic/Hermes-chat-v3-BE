import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';

describe('Conversation create test (e2e)', () => {
  let app: INestApplication;
  let userToken;
  let user;
  let userTwo;
  let userThree;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const username = 'pera';
    const email = 'pera@test.com';
    const password = '123456z';

    const usernameTwo = 'zika';
    const emailTwo = 'zika@test.com';
    const passwordTwo = '123456z';

    const usernameThree = 'mika';
    const emailThree = 'mika@test.com';
    const passwordThree = '123456z';

    user = await User.create({ username, email, password });

    userTwo = await User.create({
      username: usernameTwo,
      email: emailTwo,
      password: passwordTwo,
    });

    userThree = await User.create({
      username: usernameThree,
      email: emailThree,
      password: passwordThree,
    });

    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });
  });

  it('should return 200 if the user creates conversation with other users', () => {
    return request(app.getHttpServer())
      .post('/conversation')
      .send({
        friendsId: [userTwo.id, userThree.id],
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  });

  it('should return 500 if the frinedsId is not sent', () => {
    return request(app.getHttpServer())
      .post('/conversation')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(500);
  });
});
