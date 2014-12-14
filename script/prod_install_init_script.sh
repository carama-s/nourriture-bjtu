#!/bin/bash

cp ./script/pm2_nourriture.sh /etc/init.d/pm2_nourriture
chmod +x /etc/init.d/pm2_nourriture
update-rc.d pm2_nourriture defaults
service pm2_nourriture enable
service pm2_nourriture start
