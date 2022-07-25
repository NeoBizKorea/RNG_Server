#!/bin/sh
# cd /home
cd /home/ubuntu/ciscryp
sudo iptables -A PREROUTING -t nat -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 2008
pm2 stop
pm2 kill
pm2 start app.js