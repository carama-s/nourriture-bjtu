FROM  ubuntu:14.04

# Install basic packages
RUN apt-get update -y && apt-get install -y build-essential curl python

# Install io.js v1.5.1
RUN curl https://iojs.org/dist/v1.5.1/iojs-v1.5.1-linux-x64.tar.xz | tar xJ --strip-components 1 -C /usr/local && \
echo "io.js: `node --version`" && \
echo "NPM:   `npm --version`"

# Install GraphicsMagick
RUN apt-get install -y graphicsmagick

# Empty apt cache
RUN apt-get clean

# Install app
RUN mkdir /app
WORKDIR /app
COPY  package.json ./package.json
RUN npm install && npm dedupe
RUN mkdir src
COPY  ./src/ ./src/
EXPOSE  3000
ENV HTTP_PORT=3000
CMD ["npm", "start"]
