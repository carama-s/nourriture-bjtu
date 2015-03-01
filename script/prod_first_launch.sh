#!/bin/bash

apt-get update
apt-get install git docker.io python-pip
pip install -U docker-compose

docker-compose up -d
