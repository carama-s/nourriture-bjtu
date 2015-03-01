#!/bin/bash
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  cd ~/nourriture-bjtu-api
  git pull
  docker-compose up -d
  exit
EOF
