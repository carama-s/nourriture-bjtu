FROM    ubuntu:14.10
MAINTAINER  Gosselin Jean-Baptiste <gosselinjb@gmail.com>

WORKDIR /app
VOLUME  /app/uploads

RUN     apt-get update -y && apt-get install -y \
        nodejs-legacy \
        npm \
        graphicsmagick
COPY    package.json /app/
RUN     cd /app; npm install --production
COPY    . /app/

CMD     ["node", "manage.js", "runserver"]
