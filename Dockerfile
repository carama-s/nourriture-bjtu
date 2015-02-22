FROM    ubuntu:14.10
MAINTAINER  Gosselin Jean-Baptiste <gosselinjb@gmail.com>

EXPOSE  3000
WORKDIR /app
VOLUME  /app/uploads
ENV     NODE_ENV production

RUN     apt-get update -y && apt-get install -y \
        nodejs-legacy \
        npm \
        graphicsmagick
COPY    package.json /app/
RUN     cd /app; npm install --production
COPY    . /app/

CMD     ["node", "manage.js", "runserver"]
