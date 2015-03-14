#!/bin/sh
./compose.sh build && ./compose.sh up -d &&\
DANGLING_IMAGES=$(docker images -q -f "dangling=true") &&\
if [ -n "$DANGLING_IMAGES" ]; then
  docker rmi $DANGLING_IMAGES
fi
