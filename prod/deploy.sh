#!/bin/bash
scp ./prod/docker-compose.yml nourriture-prod@nourriture.dennajort.fr:docker-compose.yml && \
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  docker-compose -p "nourriturebjtu" pull && \
  docker-compose -p "nourriturebjtu" up -d
EOF
