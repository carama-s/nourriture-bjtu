#!/bin/bash
FIG_PROJECT_NAME=nourriturebjtu
docker-compose pull --allow-insecure-ssl && \
docker pull docker.dennajort.fr/nourriturebjtu_api && \
docker pull docker.dennajort.fr/nourriturebjtu_nginx && \
docker-compose up -d && \
sh ./remove_dangling.sh
