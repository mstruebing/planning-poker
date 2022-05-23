FROM node:16.15.0-alpine3.14

WORKDIR /src
COPY . /src

EXPOSE 8080

RUN npm install
CMD ["npm", "run", "start"]
