FROM node:20.5

COPY ./ /srv/app/

WORKDIR /srv/app/

RUN npm install -g vite
RUN npm install

CMD ["npm", "run", "dev"]
