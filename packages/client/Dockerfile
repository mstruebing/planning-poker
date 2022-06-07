FROM node:16.15.0-alpine3.14 as builder

WORKDIR /src

ADD package*.json /src
RUN npm install

ADD . /src
RUN npm run build

FROM nginx:1.21.6-alpine

WORKDIR /usr/share/nginx/html

COPY --from=builder /src/build /usr/share/nginx/html
COPY --from=builder /src/.env.example /usr/share/nginx/html/.env

RUN apk add --update nodejs
RUN apk add --update npm
RUN npm i -g runtime-env-cra@0.2.4

EXPOSE 80

CMD ["/bin/sh", "-c", "runtime-env-cra && nginx -g \"daemon off;\""]
