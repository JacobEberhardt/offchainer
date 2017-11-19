# Base image
FROM postgres

# Set environment variables
ENV POSTGRES_DB offchainer

# Copy setup command
COPY createTable.sql /docker-entrypoint-initdb.d/
