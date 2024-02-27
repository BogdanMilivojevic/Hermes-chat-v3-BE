# Base image
FROM node:18.9

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Creates a "dist" folder with the production build
RUN npm run build

EXPOSE 4000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV


CMD if [ "$NODE_ENV" = "production" ]; \
then npm run start; \
else npm run start:dev; \
fi
