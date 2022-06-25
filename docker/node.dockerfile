FROM node:16

WORKDIR /app

COPY package.json .
RUN yarn install

COPY tsconfig.json .
COPY nodemon.json .
COPY jest.config.js .
COPY ./src ./src

EXPOSE 8080