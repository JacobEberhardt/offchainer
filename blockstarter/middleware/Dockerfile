FROM node:7.1-slim

# Create app directory
RUN mkdir -p /middleware/app
WORKDIR /middleware

# Install app dependencies
ADD package.json /middleware/
RUN npm install

# Add app source
ADD app /middleware/app

EXPOSE 8080
CMD [ "npm", "start" ]
