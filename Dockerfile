FROM    centos:centos7
MAINTAINER  Gosselin Jean-Baptiste <gosselinjb@gmail.com>

RUN     yum install -y epel-release && yum install -y GraphicsMagick

RUN     yum install -y gcc gcc-c++ make tar && \
curl http://nodejs.org/dist/v0.12.0/node-v0.12.0.tar.gz | tar xz && \
cd node-v0.12.0 && \
./configure && \
make && \
make install

RUN     mkdir /app
COPY    script/runserver.sh /runserver.sh
CMD     ["sh", "/runserver.sh"]
