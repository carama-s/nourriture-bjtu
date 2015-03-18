#!/bin/bash
export COMPOSE_PROJECT_NAME=nourriturebjtu
echo "Build images" && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_api api/ && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_nginx www/ && \
echo "Push images" && \
docker push docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_api && \
docker push docker.dennajort.fr/"$COMPOSE_PROJECT_NAME"_nginx && \
echo "Run deploy script" && \
sh ./prod/deploy.sh && \
echo "Remove dangling" && \
sh ./prod/remove_dangling.sh
