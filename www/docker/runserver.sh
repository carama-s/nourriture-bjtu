#!/bin/sh

echo "upstream api {\
server $API_PORT_3000_TCP_ADDR:$API_PORT_3000_TCP_PORT;\
keepalive 512;\
}" > /upstream.conf && \
exec nginx
