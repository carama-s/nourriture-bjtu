#!/bin/bash
export COMPOSE_PROJECT_NAME=nourriturebjtu
docker-compose pull --allow-insecure-ssl && \
docker pull docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_api && \
docker pull docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_nginx && \
docker-compose up -d && \
sh ./remove_dangling.sh
