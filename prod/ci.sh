#!/bin/bash
export COMPOSE_PROJECT_NAME=nourriturebjtu
echo "Build image" && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_api api/ && \
echo "Push image" && \
docker push docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_api && \
echo "Run deploy script" && \
sh ./prod/deploy.sh && \
echo "Remove dangling" && \
sh ./prod/remove_dangling.sh
