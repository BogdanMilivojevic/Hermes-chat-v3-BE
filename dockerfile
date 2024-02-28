## ===========================================================> The common stage
FROM node:18-alpine AS base
ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

## Remove unnecessary files from `node_modules` directory
RUN ( wget -q -O /dev/stdout https://gobinaries.com/tj/node-prune | sh ) \
 && node-prune


## ======================================================> The build image stage
FROM base AS build
ENV NODE_ENV=development

COPY . .
## This step could install only the missing dependencies (ie., development deps ones)
## but there's no way to do that with this NPM version
RUN npm ci
## Compile the TypeScript source code
RUN npm run build


## =================================================> The production image stage
FROM node:18-alpine AS prod
ENV NODE_ENV=production

EXPOSE 4000

HEALTHCHECK --interval=10m --timeout=5s --retries=3 \
        CMD wget --no-verbose --tries=1 --spider http://localhost:$PORT || exit 1

WORKDIR /app
## Copy required file to run the production application
COPY --from=base --chown=node:node /app/node_modules ./node_modules
COPY --from=base --chown=node:node /app/*.json ./
COPY --from=build --chown=node:node /app/dist ./dist/

## Dropping privileges
USER node

CMD if [ "$NODE_ENV" = "production" ]; \
then npm run start; \
else npm run start:dev; \
fi
