FROM node:18-alpine as builder

WORKDIR /build

COPY package*.json ./
COPY .npmrc ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

ENV ENVIRONMENT=prod

WORKDIR /usr/app/arcade-client

COPY --from=builder /build/dist /usr/app/arcade-client
COPY --from=builder /build/package*.json /usr/app/arcade-client/
RUN npm install --production --ignore-scripts

CMD node app/main.js
