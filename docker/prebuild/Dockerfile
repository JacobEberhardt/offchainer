# Base image
FROM node:9.4-slim

# Create directories
RUN mkdir -p /middleware/server
RUN mkdir /blockchain

# Install dependencies
RUN apt-get update -y
RUN apt-get install -y build-essential python
RUN npm install -g nodemon
