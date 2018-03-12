# Base image
FROM python:3-alpine

# Create directories
RUN mkdir -p /wd
ADD . /wd
WORKDIR /wd

# Install dependencies
RUN pip install Jinja2
