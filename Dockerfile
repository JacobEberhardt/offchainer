# Base image
FROM node:slim

# Create directories
RUN mkdir -p /middleware/server
RUN mkdir /blockchain

# Add files
ADD src/middleware/package.json /middleware
ADD src/middleware/server /middleware/server
ADD src/blockchain /blockchain

# Compile smart contracts
WORKDIR /blockchain
RUN npm install -g truffle
RUN truffle compile --compile-all

# Install dependencies
RUN yes | apt-get update
RUN yes | apt-get install build-essential python
WORKDIR /middleware
RUN npm install

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]
