FROM node:16.15.0-alpine3.14 as builder

WORKDIR /src

ADD package*.json /src
RUN npm install

ADD . /src
RUN npm run build

FROM nginx:1.21.6-alpine

COPY --from=builder /src/build /usr/share/nginx/html
EXPOSE 80
