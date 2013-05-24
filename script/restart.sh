#!/bin/bash

cd /home/2013/Gitray
forever stop server.js
NODE_ENV=production forever start server.js

cd /home/2013/proxy
forever start proxy.js