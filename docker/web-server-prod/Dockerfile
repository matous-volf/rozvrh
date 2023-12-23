FROM node:20.5 as builder

COPY ./ /srv/app/

WORKDIR /srv/app/

RUN npm install -g vite
RUN npm install

RUN npm run build

FROM nginx:1.25.3

COPY ./docker/web-server-prod/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web-server-prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /srv/app/dist/ /var/www/html/public/
