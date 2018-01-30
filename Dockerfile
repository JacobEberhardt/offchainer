# Base image
FROM localprebuild:latest

# Add files
ADD src/middleware/package.json /middleware
ADD src/middleware/server /middleware/server
ADD src/blockchain /blockchain

# Compile smart contracts
RUN npm install -g truffle
WORKDIR /blockchain
RUN truffle compile --reset --compile-all

# Install dependencies
WORKDIR /middleware
RUN npm install

# Expose port
EXPOSE 8000

# Start server
CMD ["npm", "start"]
