#!/bin/bash
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  cd ~/Nourriture-BJTU
  git pull
  npm install --production
  forever restartall
  exit
EOF
