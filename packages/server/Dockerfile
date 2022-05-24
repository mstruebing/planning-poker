FROM node:16.15.0-alpine3.14

WORKDIR /src

ADD package*.json /src
RUN npm install

ADD . /src
EXPOSE 8080

CMD ["npm", "run", "start"]
