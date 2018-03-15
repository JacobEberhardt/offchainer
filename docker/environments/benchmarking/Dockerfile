# Base image
FROM node:9.4-slim

# Create directories
RUN mkdir -p /wd/src/middleware/server /wd/src/blockchain

# Set workdir
WORKDIR /wd

# Install dependencies
RUN apt-get update -y && apt-get install -y make g++ python
RUN npm install -g truffle

# Add files
ADD package.json /wd
ADD src/ /wd/src

# Compile smart contracts
WORKDIR /wd/src/blockchain
RUN truffle compile --reset --compile-all

# Install middleware dependencies
WORKDIR /wd
RUN npm install

# Seconde build stage
FROM node:9.4-slim

# Copy files
RUN mkdir /wd
WORKDIR /wd
COPY --from=0 /wd /wd
RUN npm install -g mocha

# Expose port
EXPOSE 8000

# Start server
CMD ["mocha", "src/middleware/benchmarking/benchmarking", "--timeout", "120000", "--exit"]
