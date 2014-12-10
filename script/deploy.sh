#!/bin/bash
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  cd ~/nourriture-bjtu-api
  git pull
  npm install --production
  npm dedupe
  pm2 startOrReload processes.json
  exit
EOF
