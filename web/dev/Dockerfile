FROM node:14-alpine3.10

WORKDIR /usr/src/app
COPY package.json yarn.lock gulpfile.js ./
RUN yarn install
COPY src ./src
RUN yarn dist
