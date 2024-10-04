FROM node:22.8.0-alpine3.20

WORKDIR /srv/app/

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
