#!/bin/sh
DANGLING_IMAGES=$(docker images -q -f "dangling=true") && \
if [ -n "$DANGLING_IMAGES" ]; then
  docker rmi $DANGLING_IMAGES
fi
