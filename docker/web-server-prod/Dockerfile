FROM node:26.13.0-alpine3.24@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS builder

WORKDIR /srv/app/

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build


FROM nginx/nginx-unprivileged:1.30.6-alpine3.24-slim@sha256:984a21e29bb10d4c0e122374b97b89a2101823a9331e0f3c6c04bc285ccf447f

COPY ./docker/web-server-prod/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/web-server-prod/default.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /srv/app/dist/ /var/www/html/public/
