FROM node:18-alpine

WORKDIR /app

RUN apk update
RUN apk add --no-cache libc6-compat curl

ENV NODE_ENV production

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY --chown=node:node /src ./src

USER node
EXPOSE 3000

ENTRYPOINT ["/bin/sh", "-c", "node src/index.js"]