# Base image
FROM localprebuild:latest

# Add files
ADD src/middleware/package.json /middleware
ADD src/middleware/server /middleware/server
ADD src/blockchain /blockchain

# Install dependencies
WORKDIR /middleware
RUN npm install

# Expose port
EXPOSE 8000

# Set dockerhost
RUN export DOCKERHOST=$(ip route show | awk '/default/ {print $3}')

# Start server
CMD ["npm", "start"]
