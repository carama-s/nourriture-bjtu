#!/bin/bash
scp ./prod/docker-compose.yml nourriture-prod@nourriture.dennajort.fr:docker-compose.yml && \
scp ./prod/remove_dangling.sh nourriture-prod@nourriture.dennajort.fr:remove_dangling.sh && \
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  docker-compose -p "nourriturebjtu" pull --allow-insecure-ssl && \
  docker pull docker.dennajort.fr/nourriturebjtu_api && \
  docker pull docker.dennajort.fr/nourriturebjtu_nginx && \
  docker-compose -p "nourriturebjtu" up -d && \
  sh ./remove_dangling.sh
EOF
