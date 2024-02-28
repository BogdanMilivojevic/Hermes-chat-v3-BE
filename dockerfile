FROM node:18.9-alpine

WORKDIR /app

COPY --chown=node:node package*.json ./

#Install app dependencies
RUN npm ci && npm cache clean --force

RUN apk update && apk add bash

#Bundle app source
COPY --chown=node:node . .

#chown gives permission for dist folder to be transfered
RUN chown -R node /app
USER node

RUN npm run build

#Start the server using the production build
CMD if [ "$NODE_ENV" = "production" ]; \
then npm run start; \
else npm run start:dev; \
fi



