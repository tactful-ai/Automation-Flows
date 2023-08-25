#!/bin/sh
docker-compose -f redis-docker-compose.yml up &
npm i --registry https://registry.npmjs.org

echo "Setup completed"
echo "Use '. run.sh command' to run the project"