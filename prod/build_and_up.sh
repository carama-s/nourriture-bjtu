#!/bin/sh
./compose.sh build && ./compose.sh up -d &&\
docker rmi $(docker images -q -f "dangling=true")
