#!/bin/sh
FIG_PROJECT_NAME=nourriturebjtu
echo "Build images" && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/$FIG_PROJECT_NAME_api api/ && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/$FIG_PROJECT_NAME_nginx www/ && \
echo "Push images" && \
docker push docker.dennajort.fr/$FIG_PROJECT_NAME_api && \
docker push docker.dennajort.fr/$FIG_PROJECT_NAME_nginx && \
echo "Run deploy script" && \
sh ./prod/deploy.sh && \
echo "Remove dangling" && \
sh ./prod/remove_dangling.sh
