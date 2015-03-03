#!/bin/sh
cd /app && npm install --production && exec node manage.js runserver
