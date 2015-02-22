#!/bin/bash

apt-get update
apt-get install git docker.io

docker pull mongo:2.6.7
docker run -d \
  --name nourriture-bjtu-mongodb \
  --restart=always \
  -v /home/nourriture-prod/mongodb:/data/db \
  mongo:2.6.7

docker build -t nourriture-bjtu-api .
docker run -d \
  --name=nourriture-bjtu-api \
  --restart=always \
  -p 3000:3000 \
  --link nourriture-bjtu-mongodb:mongodb \
  -v /home/nourriture-prod/uploads:/app/uploads \
  nourriture-bjtu-api
