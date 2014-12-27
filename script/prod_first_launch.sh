#!/bin/bash
npm install --production
npm dedupe
exec pm2 startOrReload processes.json
