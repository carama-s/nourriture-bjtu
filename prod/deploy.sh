#!/bin/bash
scp ./prod/docker-compose.yml nourriture-prod@nourriture.dennajort.fr:docker-compose.yml && \
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  docker-compose -p "nourriturebjtu" pull --allow-insecure-ssl && \
  docker pull docker.dennajort.fr/nourriturebjtu_api && \
  docker pull docker.dennajort.fr/nourriturebjtu_nginx && \
  docker-compose -p "nourriturebjtu" up -d && \
  DANGLING_IMAGES=$(docker images -q -f "dangling=true") && \
  if [ -n "$DANGLING_IMAGES" ]; then
    docker rmi $DANGLING_IMAGES
  fi
EOF
