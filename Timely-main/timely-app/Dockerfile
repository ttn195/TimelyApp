FROM node:current-slim

WORKDIR /timely-app

ADD . /timely-app

COPY package.json /timely-app/package.json

EXPOSE 80

CMD ["npm", "start"]