#!/bin/sh

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

docker build -t localprebuild docker/prebuild

cd src/blockchain
rm -rf build
truffle compile --reset --compile-all

cd ../..

docker-compose up --build