FROM node:26.13.0-alpine3.24@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94

USER node

WORKDIR /srv/app/

COPY --chown=node package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
