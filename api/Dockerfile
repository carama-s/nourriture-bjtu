FROM  ubuntu:14.04

# Install basic packages
RUN apt-get update -y && apt-get install -y build-essential curl python

# Install node.js v0.12.0
RUN curl http://nodejs.org/dist/v0.12.0/node-v0.12.0-linux-x64.tar.gz | tar xz --strip-components 1 -C /usr/local && \
echo "Node: `node --version`" && \
echo "NPM:  `npm --version`"

# Install GraphicsMagick
RUN apt-get install -y graphicsmagick

# Empty apt cache
RUN apt-get clean

# Install app
RUN mkdir /app
WORKDIR /app
COPY  package.json ./package.json
RUN npm install --production
COPY  . ./
EXPOSE  3000
ENV HTTP_PORT=3000
CMD ["node", "manage.js", "runserver"]
