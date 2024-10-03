FROM node:22.8.0-alpine3.20 AS builder_app

WORKDIR /srv/app/

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache brotli \
    && rm -rf /var/cache/apk/*

COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
RUN npm install

COPY ./ ./

RUN npm run build

RUN find dist/ \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec brotli -6 -o {}.br {} \;

FROM ubuntu:24.04 AS builder_nginx

RUN apt update \
    && apt upgrade -y \
    && apt install -y libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev wget git gcc make libbrotli-dev

WORKDIR /app
RUN wget https://nginx.org/download/nginx-1.25.3.tar.gz && tar -zxf nginx-1.25.3.tar.gz
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
RUN cd nginx-1.25.3 && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
    && make modules

FROM nginx:1.25.3
COPY --from=builder_nginx /app/nginx-1.25.3/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/

COPY ./docker/web-server-prod/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web-server-prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder_app /srv/app/dist/ /var/www/html/public/
