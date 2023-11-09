import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';

describe('Friend request test (e2e)', () => {
  let app: INestApplication;
  let userToken;
  let userTwoToken;
  let user;
  let userTwo;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const username = 'djura';
    const email = 'djura@test.com';
    const password = '123456z';

    const usernameTwo = 'andrija';
    const emailTwo = 'andrija@test.com';
    const passwordTwo = '123456z';

    user = await User.create({ username, email, password });

    userTwo = await User.create({
      username: usernameTwo,
      email: emailTwo,
      password: passwordTwo,
    });

    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });

    userTwoToken = jwt.sign({ id: userTwo.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });
  });

  it('should return 200 if the user makes friend request', () => {
    return request(app.getHttpServer())
      .post('/users/friend-request')
      .send({
        id: userTwo.id,
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  });

  it('should return 400 if the user makes friend request to himself', () => {
    return request(app.getHttpServer())
      .post('/users/friend-request')
      .send({
        id: user.id,
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(400);
  });

  it('should return 200 if the user retrieves friend requests', () => {
    return request(app.getHttpServer())
      .get('/users/friend-request')
      .query({ type: 'received' })
      .set('Authorization', `Bearer ${userTwoToken}`)
      .expect(200);
  });

  it('should return 200 if the user retrieves friends', () => {
    return request(app.getHttpServer())
      .get('/users/friends')
      .set('Authorization', `Bearer ${userTwoToken}`)
      .expect(200);
  });
});
