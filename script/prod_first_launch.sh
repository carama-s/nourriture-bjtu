#!/bin/bash
npm install --production
exec pm2 startOrReload processes.json
