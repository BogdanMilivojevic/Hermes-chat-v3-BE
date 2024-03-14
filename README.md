![Testing](https://github.com/BogdanMilivojevic/Hermes-chat-v3-BE/actions/workflows/pull.yml/badge.svg)

# Hermes-chat-v3-BE

## Description

#### Hermes-chat-v3-BE is a backend for a real-time messaging app which is available at: [https://hermes-chat.bogdanmilivojevic.com/](https://hermes-chat.bogdanmilivojevic.com/)

## Resources used

- [Nest.js](https://nestjs.com/)
- [Typescript](https://www.typescriptlang.org/)
- [Docker](https://www.docker.com/)
- [Postgres](https://www.postgresql.org/)
- [Sequelize](https://sequelize.org/)
- [Redis](https://redis.io/)
- [Jest](https://jestjs.io/)

## Features

- Websocket enables real-time messaging
- Websocket together with Redis enables display of online status for users
- Image, video and document sharing between users
- Friend request must be accepted before conversation is initialiased
- CI-CD pipeline which makes test passing a requirement for a successful merge
- Tests are made with jest

## Installation

### Step 1

#### Installed docker engine on your machine is a prerequisite

- **Clone the repository**

```
git clone https://github.com/BogdanMilivojevic/Hermes-chat-v3-BE.git
```

- **Create .env file following the .env.example**

- **Build docker image**

```
 docker compose build
```

### Step 2

All commands should be run inside of the container which can be accessed by running ./bin/container from the root

When inside the container, run the following npm commands:

to create a database:

```
npm run db:create
```

run migrations:

```
npm run db:migrate
```
### Step 3

exit the container

Down the container with

```
docker copmose down
```

### Step 4

To run the app in development use .dev compose file with

```
docker copmose -f docker-compose.dev.yml
```

## Testing

### Step 1

To run tests you should also run ./bin/container from the root in order to open the container

Set the NODE_ENV to test

### Step 2

Create database

```
npm run db:create
```

Run migrations

```
npm run db:migrate
```

### Step 3

Run tests

```
npm run test:e2e
```
