#!/bin/bash

dirname=`dirname $0`
$dirname/build.sh
docker-compose up
