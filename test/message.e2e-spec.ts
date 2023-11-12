import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';
import { UserRelationship } from 'src/users/user-relationship.entity';

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

    const friendRequest = await UserRelationship.create({
      receiver_user_id: user.id,
      sender_user_id: userTwo.id,
    });

    await UserRelationship.update(
      {
        type: 'friend',
      },
      {
        where: {
          id: friendRequest.id,
        },
      },
    );

    userToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: `${process.env.JWT_EXPIRES_IN}`,
    });
  });

  it('should return 200 if the user send message in the conversation', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .send({
        friendsId: [userTwo.id],
        text: 'Hello there',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(201);
  });

  it('should return 500 if the frinedsId is not sent', () => {
    return request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(500);
  });
});
