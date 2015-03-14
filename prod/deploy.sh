#!/bin/bash
ssh nourriture-prod@nourriture.dennajort.fr <<EOF
  cd ~/nourriture-bjtu-api && git pull && \
  cd prod && ./build_and_up.sh
  exit
EOF
