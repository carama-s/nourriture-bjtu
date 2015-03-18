#!/bin/bash
scp ./prod/docker-compose.yml ./prod/remove_dangling.sh nourriture-prod@nourriture.dennajort.fr && \
ssh nourriture-prod@nourriture.dennajort.fr < ./prod/server.sh
