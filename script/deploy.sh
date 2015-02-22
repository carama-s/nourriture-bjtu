#!/bin/bash
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  cd ~/nourriture-bjtu-api
  git pull
  docker build -t nourriture-bjtu-api .
  docker stop nourriture-bjtu-api
  docker rm nourriture-bjtu-api
  docker run -d \
    --name=nourriture-bjtu-api \
    --restart=always \
    -p 3000:3000 \
    --link nourriture-bjtu-mongodb:mongodb \
    -v /home/nourriture-prod/uploads:/app/uploads \
    nourriture-bjtu-api
  exit
EOF
