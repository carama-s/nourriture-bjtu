FROM  centos:centos7

# Install node.js v0.12
RUN yum install -y gcc gcc-c++ make tar && \
curl http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz | tar xz && \
cd node-v0.12.0 && ./configure && make && make install && \
cd .. && rm -r node-v0.12.0

# Install GraphicsMagick
RUN yum install -y epel-release && yum install -y GraphicsMagick

# Install app
RUN   mkdir /app
COPY  package.json /app/package.json
RUN   cd /app && npm install --production
COPY  . /app/

# Set CMD
WORKDIR /app
EXPOSE  3000
ENV     HTTP_PORT=3000
CMD     ["node", "/app/manage.js", "runserver"]
