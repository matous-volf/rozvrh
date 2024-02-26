FROM node:20.5 as builder_app

COPY ./ /srv/app/

WORKDIR /srv/app/

RUN npm install -g vite
RUN npm install

RUN npm run build

FROM ubuntu:22.04 as builder_nginx

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
COPY --from=builder_nginx /app/nginx-1.25.3/objs/ngx_http_brotli_filter_module.so /etc/nginx/modules/

COPY ./docker/web-server-prod/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web-server-prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder_app /srv/app/dist/ /var/www/html/public/
