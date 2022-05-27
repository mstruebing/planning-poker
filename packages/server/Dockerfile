FROM node:16.15.0-alpine3.14 as builder

WORKDIR /src

ADD package*.json /src
RUN npm install

ADD . /src
RUN npm run build

FROM node:16.15.0-alpine3.14 

WORKDIR /src

COPY --from=builder /src /src/
RUN rm -rf node_modules
RUN npm install --production


EXPOSE 8080
CMD ["node", "dist/index.js"]
