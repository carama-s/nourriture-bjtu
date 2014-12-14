#!/bin/bash

cp ./script/pm2_nourriture.sh /etc/init.d/pm2_nourriture
chmod +x /etc/init.d/pm2_nourriture
update-rc.d pm2_nourriture defaults
update-rc.d pm2_nourriture enable
update-rc.d pm2_nourriture start
