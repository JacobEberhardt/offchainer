#!/bin/bash

dirname=`dirname $0`
docker build -t localprebuild $dirname/../docker/prebuild
docker-compose build
