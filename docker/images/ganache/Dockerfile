# Specify base image
FROM node:9.4-slim

# Install dependencies
RUN apt-get update && apt-get install -y git
RUN npm install -g ganache-cli

# Set default command
CMD ["ganache-cli", "-a", "10", "-p", "7545"]
