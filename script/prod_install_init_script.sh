#!/bin/bash

cp ./script/pm2_nourriture.sh /etc/init.d/
chmod +x /etc/init.d/pm2_nourriture.sh
update-rc.d pm2_nourriture defaults
update-rc.d pm2_nourriture enable
