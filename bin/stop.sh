#!/bin/bash

cd /home/2013/Gitray
forever stop server.js

cd /home/2013/proxy
forever stop proxy.js