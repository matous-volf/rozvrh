FROM node:22.8.0-alpine3.20 AS builder_app

WORKDIR /srv/app/

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache brotli \
    && rm -rf /var/cache/apk/*

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

RUN find dist/ \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec brotli -6 -o {}.br {} \;

FROM alpine:3.20 AS builder_nginx

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache git gcc musl-dev pcre-dev zlib-dev make brotli-dev \
    && rm -rf /var/cache/apk/*

WORKDIR /app
RUN wget https://nginx.org/download/nginx-1.27.2.tar.gz && tar -zxf nginx-1.27.2.tar.gz
RUN git clone --recurse-submodules -j8 https://github.com/google/ngx_brotli
RUN cd nginx-1.27.2 && ./configure --with-compat --add-dynamic-module=../ngx_brotli \
    && make modules

FROM nginx:1.27.2-alpine3.20-slim
COPY --from=builder_nginx /app/nginx-1.27.2/objs/ngx_http_brotli_static_module.so /etc/nginx/modules/

COPY ./docker/web-server-prod/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web-server-prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder_app /srv/app/dist/ /var/www/html/public/
