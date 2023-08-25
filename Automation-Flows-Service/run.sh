#!/bin/sh

env=$1
if [ "$( docker container inspect -f '{{.State.Status}}' automation-redis )" != "running" ]; 
    then docker start automation-redis 
fi
npm run build
npm run $env