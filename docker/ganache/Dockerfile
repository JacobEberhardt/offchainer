# Specify base image
FROM node:9.4-alpine

# Install dependencies
RUN npm install -g ganache-cli

# Set default command
CMD ["ganache-cli", "-a", "10", "-p", "7545"]
