FROM node:18-alpine

RUN apk add --no-cache bash

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "test"]
