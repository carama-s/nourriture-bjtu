#!/bin/sh

echo "Build images" && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/nourriturebjtu_api api/ && \
docker build --force-rm=true --pull=true -t docker.dennajort.fr/nourriturebjtu_nginx www/ && \
echo "Push images" && \
docker push docker.dennajort.fr/nourriturebjtu_api && \
docker push docker.dennajort.fr/nourriturebjtu_nginx && \
echo "Run deploy script" && \
sh ./prod/deploy.sh
