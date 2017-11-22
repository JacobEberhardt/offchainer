# Base image
FROM node:7.1-slim

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
WORKDIR /middleware
RUN npm install

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]
