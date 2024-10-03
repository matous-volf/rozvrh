FROM node:22.8.0-alpine3.20

COPY ./ /srv/app/

WORKDIR /srv/app/

RUN npm install

CMD ["npm", "run", "dev"]
