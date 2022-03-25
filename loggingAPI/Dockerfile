FROM node:latest

WORKDIR /loggingAPI
COPY . .

VOLUME [ "/data" ]

RUN npm install

CMD ["npm", "start"]